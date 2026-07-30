<?php

namespace App\Mail;

use App\Models\Agency;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AgencyRegistrationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Agency $agency)
    {
    }

    public function build(): self
    {
        return $this
            ->subject("New agency registration — {$this->agency->name}")
            ->view('emails.agency-registration-submitted')
            ->with(['agency' => $this->agency]);
    }
}
