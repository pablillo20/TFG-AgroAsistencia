@component('mail::layout')
{{-- Encabezado personalizado --}}
@slot('header')
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #2e7d32; padding: 20px 0;">
    <tr>
        <td align="center">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;"> -  📬 Nuevo Mensaje de Contacto</h1>
        </td>
    </tr>
</table>
@endslot

{{-- Cuerpo del mensaje --}}
<p style="font-size: 16px; color: #333;">
    Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web. A continuación los detalles:
</p>

<table style="width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 16px;">
    <tr>
        <td style="font-weight: bold; padding: 10px 0; color: #2e7d32;">👤 Nombre:</td>
        <td style="padding: 10px 0;">{{ $nombre }}</td>
    </tr>
    <tr>
        <td style="font-weight: bold; padding: 10px 0; color: #2e7d32;">✉️ Correo electrónico:</td>
        <td style="padding: 10px 0;">{{ $userEmail }}</td>
    </tr>
    <tr>
        <td style="font-weight: bold; padding: 10px 0; color: #2e7d32;">📝 Mensaje:</td>
        <td style="padding: 10px 0;">{{ $mensaje }}</td>
    </tr>
</table>

<p style="font-size: 16px; color: #333;">
    Por favor, responde al mensaje lo antes posible. Gracias por mantener una buena comunicación.
</p>

{{-- Firma --}}
<p style="margin-top: 30px; font-size: 14px; color: #777;">
    — Equipo de Agenda Agrícola
</p>

{{-- Pie de página personalizado --}}
@slot('footer')
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
        <td align="center" style="font-size: 12px; color: #999;">
            © {{ date('Y') }} Agenda Agrícola. Todos los derechos reservados.
        </td>
    </tr>
</table>
@endslot
@endcomponent
