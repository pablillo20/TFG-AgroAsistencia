<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        // CAMBIA ESTO por la URL exacta de tu aplicación React
        $allowedOrigin = 'http://agroasistencia.es'; 
        if ($request->getMethod() === "OPTIONS") {
            return response()->json('OK', 200, [
                'Access-Control-Allow-Origin' => $allowedOrigin, // <-- ¡Origen específico aquí!
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept',
                'Access-Control-Allow-Credentials' => 'true', // <-- Mantén esta línea
            ]);
        }

        $response = $next($request);

        $response->header('Access-Control-Allow-Origin', $allowedOrigin); // <-- ¡Origen específico aquí!
        $response->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
        $response->header('Access-Control-Allow-Credentials', 'true'); // <-- Mantén esta línea
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

        return $response;
    }
}