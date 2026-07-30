<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments)
    {
    }

    /**
     * POST /api/bookings/{booking}/payment/create-order
     * Creates (or reuses) a SabPaisa payment session for this booking and
     * returns the checkoutUrl the frontend redirects the customer to.
     */
    public function store(Booking $booking)
    {
        abort_if($booking->payment_status === 'paid', 422, 'This booking is already paid.');

        // Reuse an existing unpaid session rather than spawning a new one on
        // every retry — but SabPaisa checkout sessions expire after 30
        // minutes, so an expired one still needs replacing.
        $payment = $booking->payments()
            ->where('status', 'created')
            ->where('expires_at', '>', now())
            ->latest()
            ->first()
            ?? $this->payments->createOrderForBooking($booking);

        return response()->json([
            'checkout_url' => $payment->checkout_url,
            'booking_number' => $booking->booking_number,
            'customer_name' => $booking->customer_name,
            'customer_email' => $booking->customer_email,
            'customer_phone' => $booking->customer_phone,
        ]);
    }

    /**
     * POST /api/bookings/{booking}/payment/verify
     * Called by the frontend's payment-return page after SabPaisa redirects
     * the customer back. Any query params SabPaisa attaches to that redirect
     * are informational only — per SabPaisa's docs, return-URL params must
     * never be trusted alone, so this always re-confirms via the
     * Transaction Enquiry API inside PaymentService::verifyAndMarkPaid().
     */
    public function verify(Booking $booking)
    {
        $payment = $booking->payments()->latest()->firstOrFail();

        $verified = $this->payments->verifyAndMarkPaid($payment);

        return response()->json([
            'message' => match ($verified->status) {
                'paid' => 'Payment verified.',
                'failed' => 'Payment failed.',
                default => 'Payment is still processing.',
            },
            'booking_id' => $booking->id,
            'payment_status' => $booking->fresh()->payment_status,
            'payment_id' => $verified->gateway_payment_id,
        ]);
    }

    /**
     * POST /api/webhooks/sabpaisa
     * Server-to-server confirmation, independent of whether the customer's
     * browser makes it back to the return URL. Registered in the SabPaisa
     * dashboard, not called by this frontend. The webhook body's status is
     * treated as a trigger only — the actual status update goes through the
     * same Enquiry-API-backed verifyAndMarkPaid() as the return-URL path.
     */
    public function webhook(Request $request)
    {
        $event = $request->input('event');
        $merchantTxnId = $request->input('data.merchantTxnId');

        if (! in_array($event, ['payment.success', 'payment.failed'], true) || ! $merchantTxnId) {
            return response()->json(['status' => 'ignored']);
        }

        $payment = Payment::where('gateway_order_id', $merchantTxnId)->first();

        if ($payment) {
            $this->payments->verifyAndMarkPaid($payment);
        }

        return response()->json(['status' => 'ok']);
    }
}
