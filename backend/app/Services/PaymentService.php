<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

/**
 * Talks to SabPaisa's PG 3.0 REST API (https://devdocs.sabpaisa.in). Every
 * request carries an X-Api-Key header plus an HMAC-SHA256 checksum of
 * "merchantId|merchantTxnId|amount|currency|timestamp" signed with the
 * secret key — per SabPaisa's Quick Start guide. This environment can't
 * reach SabPaisa's API, so the HTTP calls below are unverified here.
 */
class PaymentService
{
    private string $baseUrl;
    private string $apiKey;
    private string $secretKey;
    private string $merchantId;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.sabpaisa.base_url'), '/');
        $this->apiKey = config('services.sabpaisa.api_key');
        $this->secretKey = config('services.sabpaisa.secret_key');
        $this->merchantId = config('services.sabpaisa.merchant_id');
    }

    public function createOrderForBooking(Booking $booking): Payment
    {
        $amountInPaise = (int) round($booking->total_amount * 100);
        $merchantTxnId = "ORD_{$booking->booking_number}_" . now()->format('YmdHis');
        $timestamp = now()->timestamp;
        $currency = 'INR';

        $response = Http::withHeaders(['X-Api-Key' => $this->apiKey])
            ->post("{$this->baseUrl}/api/v2/payments", [
                'merchantId' => $this->merchantId,
                'merchantTxnId' => $merchantTxnId,
                'amount' => $amountInPaise,
                'currency' => $currency,
                'returnUrl' => $this->returnUrlFor($booking),
                'timestamp' => $timestamp,
                'checksum' => $this->checksum($merchantTxnId, $amountInPaise, $currency, $timestamp),
            ])
            ->throw()
            ->json();

        return $booking->payments()->create([
            'gateway' => 'sabpaisa',
            'gateway_order_id' => $merchantTxnId,
            'gateway_payment_id' => $response['paymentId'] ?? null,
            'checkout_url' => $response['checkoutUrl'],
            'expires_at' => isset($response['expiresAt']) ? Carbon::parse($response['expiresAt']) : now()->addMinutes(30),
            'amount' => $amountInPaise,
            'currency' => $currency,
            'status' => 'created',
        ]);
    }

    /**
     * Confirms payment status server-side via the Transaction Enquiry API.
     * Callers must never mark a booking paid off return-URL query params or
     * a webhook payload alone — SabPaisa's docs explicitly warn those can be
     * replayed/bookmarked; this is the only trustworthy source of truth.
     */
    public function verifyAndMarkPaid(Payment $payment): Payment
    {
        if ($payment->status === 'paid') {
            return $payment;
        }

        $response = Http::withHeaders(['X-Api-Key' => $this->apiKey])
            ->post("{$this->baseUrl}/api/v2/payments/enquiry", [
                'merchantId' => $this->merchantId,
                'merchantTxnId' => $payment->gateway_order_id,
            ])
            ->throw()
            ->json();

        $status = $response['data']['status'] ?? null;

        if ($status === 'SUCCESS') {
            $payment->update([
                'gateway_payment_id' => $response['data']['paymentId'] ?? $payment->gateway_payment_id,
                'status' => 'paid',
            ]);
            $payment->booking->update(['payment_status' => 'paid']);
        } elseif ($status === 'FAILED') {
            $this->markFailed($payment, $response['data']['failureReason'] ?? 'Payment failed.');
        }

        return $payment->fresh();
    }

    public function markFailed(Payment $payment, ?string $reason = null): Payment
    {
        $payment->update(['status' => 'failed', 'failure_reason' => $reason]);

        return $payment;
    }

    private function checksum(string $merchantTxnId, int $amount, string $currency, int $timestamp): string
    {
        $input = "{$this->merchantId}|{$merchantTxnId}|{$amount}|{$currency}|{$timestamp}";

        return hash_hmac('sha256', $input, $this->secretKey);
    }

    private function returnUrlFor(Booking $booking): string
    {
        return rtrim(config('services.frontend.url'), '/') . "/dashboard/bookings/{$booking->id}/payment/return";
    }
}
