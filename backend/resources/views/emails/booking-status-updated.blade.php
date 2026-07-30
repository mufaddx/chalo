@extends('emails.layout')

@section('title', 'Booking status updated')

@section('content')
    @php
        $statusCopy = [
            'confirmed' => ['Your booking is confirmed 🎉', 'Pack your bags — ' . $booking->agency->name . ' has confirmed your seats.'],
            'cancelled' => ['Your booking was cancelled', 'This booking has been cancelled. If you were charged, a refund is on its way per our cancellation policy.'],
            'completed' => ['Hope you had a great trip!', 'Your tour with '.$booking->agency->name.' is marked complete. We would love to hear how it went.'],
        ];
        [$heading, $body] = $statusCopy[$booking->status->value] ?? ['Booking updated', 'Your booking status has changed.'];
    @endphp

    <h1 style="margin:0 0 4px; font-size:22px; color:#0e1420;">{{ $heading }}</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#626b78; line-height:1.6;">{{ $body }}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; border-radius:12px; padding:16px; margin-bottom:20px;">
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Booking ID</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->booking_number }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Tour</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->tour->title }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Status</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right; text-transform:capitalize;">{{ $booking->status->value }}</td>
        </tr>
        @if ($booking->status->value === 'cancelled' && $booking->cancelled_reason)
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Reason</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; text-align:right;">{{ $booking->cancelled_reason }}</td>
        </tr>
        @endif
    </table>
@endsection
