<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trabajos;
use App\Models\Token;
use App\Models\Maquinaria;

class TrabajoController extends Controller
{
    /**
     * Crea un nuevo trabajo.  
     */
    public function store($token, Request $request)
    {
        // Verifica si el token es válido y obtiene el id_usuario asociado.
        $id_usuario = Token::where('token', $token)->value('id_usuario');
        if (!$id_usuario) {
            return response()->json(['error' => 'Token inválido o no encontrado.'], 401);
        }

        // Valida los datos del request.
        // Ahora, id_usuario no es requerido en el cuerpo de la solicitud,
        // y id_maquinaria es opcional (nullable).
        $request->validate([
            'nombre' => 'required|string|max:255',
            'id_maquinaria' => 'nullable|integer|exists:maquinaria,id_maquinaria',
        ]);

        // 3. Crea el trabajo con los datos proporcionados.
        // Usamos el $id_usuario que obtuvimos del token.
        $trabajo = Trabajos::create([
            'nombre' => $request->nombre,
            'id_maquinaria' => $request->id_maquinaria, // Será null si no se proporciona
            'id_usuario' => $id_usuario, // Este es el id del usuario autenticado
        ]);

        return response()->json($trabajo, 201);
    }

    /**
     * Muestra todos los trabajos de un usuario específico.
     */
    public function index($token)
    {
        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $id_usuario = Token::where('token', $token)->value('id_usuario');
        // Validar que el ID de usuario sea un número entero
        if (!is_numeric($id_usuario)) {
            return response()->json(['error' => 'El ID de usuario debe ser un número entero.'], 400);
        }
        // Buscar los trabajos asociados al ID de usuario
        $trabajos = Trabajos::where('id_usuario', $id_usuario)->get();

        return response()->json($trabajos);
    }

    /**
     * Muestra un trabajo específico por ID.
     */
    public function show(Trabajos $trabajo) 
    {
        return response()->json($trabajo);
    }

    /**
     * Elimina un trabajo específico por ID.
     */
    public function destroy($id_trabajo) 
    {

        $trabajo = Trabajos::find($id_trabajo);
        if (!$trabajo) {
            return response()->json(['message' => 'Trabajo no encontrado'], 404);
        }


        $trabajo->delete();
        return response()->json(['message' => 'Trabajo eliminado correctamente']);
    }
}

