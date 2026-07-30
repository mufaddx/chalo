@extends('emails.layout')

@section('title', 'Booking received')

@section('content')
    <h1 style="margin:0 0 4px; font-size:22px; color:#0e1420;">Thanks, {{ explode(' ', $booking->customer_name)[0] }} — we've got your booking</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#626b78; line-height:1.6;">
        {{ $booking->agency->name }} will confirm your seats shortly. We'll email you again the moment it's confirmed.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; border-radius:12px; padding:16px; margin-bottom:24px;">
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Booking ID</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->booking_number }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Tour</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->tour->title }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Travel date</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->tourDate->departure_date->format('d M Y') }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Travellers</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->totalTravellers() }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Total amount</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">&#8377;{{ number_format((float) $booking->total_amount) }}</td>
        </tr>
    </table>

    <p style="margin:0; font-size:13px; color:#97a0ab;">
        Status: <strong style="color:#c1852f;">Pending confirmation</strong>
    </p>
@endsection
