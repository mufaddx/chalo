<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingReceivedCustomer extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Booking $booking)
    {
    }

    public function build(): self
    {
        return $this
            ->subject("Booking received — {$this->booking->booking_number}")
            ->view('emails.booking-received-customer')
            ->with(['booking' => $this->booking->load(['tour', 'agency', 'tourDate'])]);
    }
}
