<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Sugerencia de Fitosanitario</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #2c3e50;
        }

        .container {
            max-width: 640px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
            padding: 30px;
        }

        h1 {
            color: #2e7d32;
            font-size: 24px;
            text-align: center;
            margin-bottom: 25px;
        }

        p {
            font-size: 16px;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .strong {
            font-weight: 600;
            color: #1b1b1b;
        }

        .saludo {
            margin-top: 30px;
            text-align: right;
            font-style: italic;
            color: #666;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #999;
            font-size: 13px;
        }

        .button {
            display: inline-block;
            background-color: #2e7d32;
            color: #fff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            margin-top: 25px;
            text-align: center;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #27682a;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌿 Nueva Sugerencia de Fitosanitario</h1>
        <p>Se ha recibido una nueva sugerencia desde el formulario de fitosanitarios:</p>

        <p><span class="strong">💡 Sugerencia:</span><br> {{ $sugerencia }}</p>
        <p><span class="strong">👤 Sugerido por:</span><br> {{ $userEmail }}</p>

        <p class="saludo">Gracias,</p>
        <p class="saludo">Equipo de Agenda Agrícola</p>
    </div>

    <div class="footer">
        © {{ date('Y') }} Agenda Agrícola. Todos los derechos reservados.
    </div>
</body>
</html>
