<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Booking $booking)
    {
    }

    public function build(): self
    {
        $label = ucfirst($this->booking->status->value);

        return $this
            ->subject("Booking {$this->booking->booking_number} is now {$label}")
            ->view('emails.booking-status-updated')
            ->with(['booking' => $this->booking->load(['tour', 'agency'])]);
    }
}
