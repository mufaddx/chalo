<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingReceivedAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Booking $booking)
    {
    }

    public function build(): self
    {
        return $this
            ->subject("[Admin] New booking — {$this->booking->booking_number}")
            ->view('emails.booking-received-admin')
            ->with(['booking' => $this->booking->load(['tour', 'agency', 'tourDate'])]);
    }
}
