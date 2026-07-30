@extends('emails.layout')

@section('title', 'New booking — admin copy')

@section('content')
    <h1 style="margin:0 0 4px; font-size:22px; color:#0e1420;">New booking: {{ $booking->booking_number }}</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#626b78; line-height:1.6;">
        Admin copy — informational only, no action required unless the agency doesn't respond.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; border-radius:12px; padding:16px;">
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Tour</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->tour->title }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Agency</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->agency->name }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Customer</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $booking->customer_name }} &middot; {{ $booking->customer_email }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Total amount</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">&#8377;{{ number_format((float) $booking->total_amount) }}</td>
        </tr>
    </table>
@endsection
