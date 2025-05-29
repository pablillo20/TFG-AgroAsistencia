<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Mail\Contacto; // Importa la clase Mailable

class ContactoController extends Controller
{
    /**
     * Procesa el envío del formulario de contacto a través de una API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enviarSugerencia(Request $request)
    {
        // 1. Validar los datos del formulario
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mensaje' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Error de validación',
                'errores' => $validator->errors(), // Devuelve los errores detallados
            ], 422); // Código de estado para "Unprocessable Entity"
        }

        // 2. Obtener los datos validados
        $datos = $validator->validated();
        $sugerencia = $datos['mensaje'];
        $userEmail = $datos['email'];
        $nombre = $datos['nombre'];

        // 3. Enviar el correo electrónico
        try {
            Mail::to('rubiopablo577@gmail.com') 
                ->send(new Contacto($sugerencia, $userEmail,$nombre));
        } catch (\Exception $e) {
            // Manejar errores al enviar el correo
            \Log::error('Error al enviar correo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al enviar el correo',
                'mensaje' => 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.',
            ], 500); // Código de estado 500 para error del servidor
        }

        // 4. Devolver una respuesta de éxito en formato JSON
        return response()->json([
            'mensaje' => 'Mensaje enviada correctamente.',
        ], 200); // Código de estado 200 para OK
    }
}
