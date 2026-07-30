<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'Voyagr')</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f1; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1; padding:32px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e6e4de;">

        {{-- Header --}}
        <tr>
          <td style="background:#0e1420; padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:20px; font-weight:700; color:#ffffff;">
                  <span style="color:#e4a64b;">&#9679;</span> Voyagr
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {{-- Body --}}
        <tr>
          <td style="padding:32px;">
            @yield('content')
          </td>
        </tr>

        {{-- Footer --}}
        <tr>
          <td style="padding:20px 32px; background:#f4f4f1; border-top:1px solid #e6e4de;">
            <p style="margin:0; font-size:12px; color:#97a0ab; line-height:1.6;">
              This is an automated message from Voyagr Technologies Pvt. Ltd.
              Please do not reply directly to this email — use the contact details
              in your booking confirmation instead.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
