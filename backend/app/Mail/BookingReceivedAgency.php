<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingReceivedAgency extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Booking $booking)
    {
    }

    public function build(): self
    {
        return $this
            ->subject("New booking alert — {$this->booking->booking_number}")
            ->view('emails.booking-received-agency')
            ->with(['booking' => $this->booking->load(['tour', 'tourDate'])]);
    }
}
