<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Agricultores;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AgricultorController extends Controller
{
    /*
    *  Mostrar Agricultores
    * */
    public function index(): JsonResponse
    {
        $agricultores = Agricultores::all();
        return response()->json($agricultores);
    }

    /*
    *  Crear Agricultor
    * */
    public function store(Request $request): JsonResponse
    {
        // Validar los datos de la petición
        $validator = Validator::make($request->all(), [
            'DNI' => 'required|string|regex:/^\d{8}[A-Za-z]$/|unique:agricultores',
            'nombre' => 'required|string|max:25',
            'apellidos' => 'required|string|max:50',
            'telefono' => 'nullable|digits:9',
            'localidad' => 'nullable|string|max:100',
        ], [
            'DNI.required' => 'El campo DNI es obligatorio.',
            'DNI.string' => 'El campo DNI debe ser una cadena de texto.',
            'DNI.regex' => 'El campo DNI debe tener 8 números seguidos de una letra.',
            'DNI.unique' => 'El DNI ya está registrado.',
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no puede tener más de 25 caracteres.',
            'apellidos.required' => 'El campo apellidos es obligatorio.',
            'apellidos.string' => 'El campo apellidos debe ser una cadena de texto.',
            'apellidos.max' => 'El campo apellidos no puede tener más de 50 caracteres.',
            'telefono.digits' => 'El campo teléfono debe tener exactamente 9 dígitos.',
            'localidad.string' => 'El campo localidad debe ser una cadena de texto.',
            'localidad.max' => 'El campo localidad no puede tener más de 100 caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear el nuevo agricultor
        $agricultor = Agricultores::create([
            'DNI' => $request->DNI,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'telefono' => $request->telefono,
            'localidad' => $request->localidad,
        ]);

        return response()->json($agricultor, 201);
    }
}

