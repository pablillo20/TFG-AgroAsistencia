<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Maquinaria;
use App\Models\Token;
use Illuminate\Support\Facades\Storage;

class MaquinariaController extends Controller
{
    // Mostrar maquinaria de un usuario específico
    public function mostrarMaquinaria($token)
    {
        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $id_usuario = Token::where('token', $token)->value('id_usuario');

        // Validar que el ID de usuario sea un número entero
        if (!is_numeric($id_usuario)) {
            return response()->json(['error' => 'El ID de usuario debe ser un número entero.'], 400);
        }
        // Buscar las maquinarias asociadas al ID de usuario
        $maquinarias = Maquinaria::where('id_usuario', $id_usuario)->get();
        return response()->json($maquinarias);
    }

    public function crearMaquinaria(Request $request, $token)
    {
        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $tokenRecord = Token::where('token', $token)->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Token inválido o no encontrado.'], 401);
        }

        $id_usuario = $tokenRecord->id_usuario;

        // Ahora, valida los datos de la solicitud
        $request->validate([
            'nombre' => 'required|string|max:255',
            // No validar 'id_usuario' aquí, ya que lo obtenemos del token
            'año' => 'required|integer',
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'numero_serie' => 'required|string|max:255|unique:maquinaria,numero_serie', // Asegúrate de que el número de serie sea único
        ]);

        $maquinaria = new Maquinaria();
        $maquinaria->nombre = $request->nombre;
        $maquinaria->id_usuario = $id_usuario; 
        $maquinaria->año = $request->año;
        $maquinaria->marca = $request->marca;
        $maquinaria->modelo = $request->modelo;
        $maquinaria->numero_serie = $request->numero_serie;

        $maquinaria->save();

        return response()->json($maquinaria, 201);
    }

    // Actualizar maquinaria (usando POST con _method=PUT)
    public function actualizarMaquinaria(Request $request, $id_maquinaria)
    {
        $maquinaria = Maquinaria::find($id_maquinaria);
        if (!$maquinaria) {
            return response()->json(['message' => 'Maquinaria no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'año' => 'required|integer',
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'numero_serie' => 'required|string|max:255',
        ]);

        $maquinaria->nombre = $request->nombre;
        $maquinaria->año = $request->año;
        $maquinaria->marca = $request->marca;
        $maquinaria->modelo = $request->modelo;
        $maquinaria->numero_serie = $request->numero_serie;

        $maquinaria->save();

        return response()->json($maquinaria);
    }

    // Eliminar maquinaria (usando POST con _method=DELETE)
    public function borrarMaquinaria($id_maquinaria)
    {
        $maquinaria = Maquinaria::find($id_maquinaria);
        if (!$maquinaria) {
            return response()->json(['message' => 'Maquinaria no encontrada'], 404);
        }

        $maquinaria->delete();

        return response()->json(['message' => 'Maquinaria eliminada correctamente']);
    }
}
