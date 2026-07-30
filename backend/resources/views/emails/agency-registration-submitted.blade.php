@extends('emails.layout')

@section('title', 'New agency registration')

@section('content')
    <h1 style="margin:0 0 4px; font-size:22px; color:#0e1420;">New agency wants to list: {{ $agency->name }}</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#626b78; line-height:1.6;">
        Review their submitted documents and approve or reject from the Super Admin panel.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; border-radius:12px; padding:16px;">
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Agency</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $agency->name }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">City</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $agency->city }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Contact email</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $agency->email }}</td>
        </tr>
        <tr>
            <td style="padding:8px 16px; font-size:13px; color:#626b78;">Years experience</td>
            <td style="padding:8px 16px; font-size:13px; color:#0e1420; font-weight:600; text-align:right;">{{ $agency->years_experience }}</td>
        </tr>
    </table>
@endsection
