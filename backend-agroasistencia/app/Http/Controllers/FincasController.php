<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Fincas;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Token;

class FincasController extends Controller
{
    /*
     * Mostrar todas las fincas
     */
    public function index(): JsonResponse
    {
        $fincas = Fincas::all();
        return response()->json($fincas);
    }



    /*
     * Mostrar una finca por  token usuarioid
     */
    public function show($token): JsonResponse
    {
        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $id_usuario = Token::where('token', $token)->value('id_usuario');
        
        // Validar que el ID de usuario sea un número entero
        if (!is_numeric($id_usuario)) {
            return response()->json(['error' => 'El ID de usuario debe ser un número entero.'], 400);
        }

        // Buscar las fincas asociadas al ID de usuario
        $fincas = Fincas::where('id_usuario', $id_usuario)->get();

        // Verificar si se encontraron fincas
        if ($fincas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron fincas para el usuario especificado.'], 404);
        }

        return response()->json($fincas, 200);
    }

    /*
     * Registrar Finca
     */
    public function store(Request $request): JsonResponse
    {
        // Validar los datos de la petición para fincas
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'nullable|string|max:255',
            'hectareas' => 'required|numeric|min:0',
        ], [
            'id_usuario.required' => 'El campo ID de usuario es obligatorio.',
            'id_usuario.integer' => 'El campo ID de usuario debe ser un número entero.',
            'id_usuario.exists' => 'El ID de usuario seleccionado no existe.',
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no puede tener más de 255 caracteres.',
            'ubicacion.string' => 'El campo ubicación debe ser una cadena de texto.',
            'ubicacion.max' => 'El campo ubicación no puede tener más de 255 caracteres.',
            'hectareas.required' => 'El campo hectáreas es obligatorio.',
            'hectareas.numeric' => 'El campo hectáreas debe ser un número.',
            'hectareas.min' => 'El campo hectáreas no puede ser negativo.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear la nueva finca
        $finca = Fincas::create([
            'id_usuario' => $request->id_usuario,
            'nombre' => $request->nombre,
            'ubicacion' => $request->ubicacion,
            'hectareas' => $request->hectareas,
        ]);

        return response()->json($finca, 201);
    }

    /*
     * Editar Finca
     */
    public function update(Request $request, $id_finca): JsonResponse
    {
        // Validar los datos de la petición para fincas
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'nullable|string|max:255',
            'hectareas' => 'required|numeric|min:0',
        ], [
            'id_usuario.required' => 'El campo ID de usuario es obligatorio.',
            'id_usuario.integer' => 'El campo ID de usuario debe ser un número entero.',
            'id_usuario.exists' => 'El ID de usuario seleccionado no existe.',
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no puede tener más de 255 caracteres.',
            'ubicacion.string' => 'El campo ubicación debe ser una cadena de texto.',
            'ubicacion.max' => 'El campo ubicación no puede tener más de 255 caracteres.',
            'hectareas.required' => 'El campo hectáreas es obligatorio.',
            'hectareas.numeric' => 'El campo hectáreas debe ser un número.',
            'hectareas.min' => 'El campo hectáreas no puede ser negativo.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar la finca a actualizar
        $finca = Fincas::find($id_finca);

        if (!$finca) {
            return response()->json(['error' => 'Finca no encontrada.'], 404);
        }

        // Actualizar los datos de la finca
        $finca->id_usuario = $request->id_usuario;
        $finca->nombre = $request->nombre;
        $finca->ubicacion = $request->ubicacion;
        $finca->hectareas = $request->hectareas;
        $finca->save();

        return response()->json($finca, 200);
    }


}