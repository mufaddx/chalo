@extends('emails.layout')

@section('title', 'New booking alert')

@section('content')
    <h1 style="margin:0 0 4px; font-size:22px; color:#0e1420;">New booking on {{ $booking->tour->title }}</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#626b78; line-height:1.6;">
        A traveller has requested a booking. Confirm or decline it from your agency dashboard.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; border-radius:12px; padding:16px; margin-bottom:20px;">
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Booking ID</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->booking_number }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Customer</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->customer_name }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Phone</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->customer_phone }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Travel date</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->tourDate->departure_date->format('d M Y') }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Travellers</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->totalTravellers() }}</td>
        </tr>
        @if ($booking->special_request)
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Special request</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; text-align:right;">{{ $booking->special_request }}</td>
        </tr>
        @endif
    </table>

    <p style="margin:0; font-size:13px; color:#97a0ab;">
        Please confirm within 24 hours — unconfirmed bookings may be reassigned.
    </p>
@endsection
