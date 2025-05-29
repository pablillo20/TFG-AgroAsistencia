<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Agricultores;
use App\Models\Fincas;
use App\Models\Fitos;
use App\Models\RegistroTrabajo;
use App\Models\Trabajos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Token;
use Carbon\Carbon; 

class RegistroTrabajoController extends Controller
{
    /**
     * Insertar un nuevo registro de trabajo en la base de datos.
     */
    public function store(Request $request): JsonResponse
    {
        // Mensajes de error personalizados en español
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'max' => 'El campo :attribute no debe superar los :max caracteres.',
            'email' => 'El campo :attribute debe ser un correo electrónico válido.',
            'unique' => 'El campo :attribute ya está en uso.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'numeric' => 'El campo :attribute debe ser un número.',
            'array' => 'El campo :attribute debe ser un array.',
            'min.array' => 'El campo :attribute debe contener al menos :min elemento.',
            'integer' => 'Los elementos del campo :attribute deben ser números enteros.',
        ];

        // Validar los datos de la petición
        // id_agricultores se espera como un array, id_fito como un entero (o null si es un array vacío)
        $validator = Validator::make($request->all(), [
            'id_agricultores' => 'required|array|min:1', // Espera un array de IDs de agricultores, al menos uno
            'id_agricultores.*' => 'integer|exists:agricultores,id_agricultor', // Cada elemento debe ser un entero y existir en la tabla agricultores
            'id_finca' => 'required|integer|exists:fincas,id_finca',
            'id_trabajo' => 'required|integer|exists:trabajos,id_trabajo',
            'id_fitos' => 'nullable|array', // Se espera un array de IDs de fitosanitarios, puede ser nulo o vacío
            'id_fitos.*' => 'integer|exists:fitosanitarios,id_fito', // Cada elemento debe ser un entero y existir
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'observaciones' => 'nullable|string|max:255',
            'fecha' => 'required|date',
            'horas_trabajadas' => 'required|numeric|min:0',
        ], $mensajes);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Formatear la fecha usando Carbon
        $fechaFormateada = Carbon::parse($request->fecha)->format('Y-m-d');

        $createdRecords = []; // Array para almacenar todos los registros de trabajo creados

        // Determinar el ID del fitosanitario a usar para cada registro.
        // Si el frontend envía un array para id_fitos, solo se toma el primer elemento.
        // Si el array está vacío o es nulo, idFitoToUse será null.
        $idFitoToUse = null;
        if (!empty($request->id_fitos) && is_array($request->id_fitos)) {
            $idFitoToUse = $request->id_fitos[0]; // Tomamos el primer ID de fitosanitario
        }

        // Iterar sobre cada ID de agricultor seleccionado y crear un registro de trabajo individual
        foreach ($request->id_agricultores as $idAgricultor) {
            $registroTrabajo = RegistroTrabajo::create([
                'id_agricultor' => $idAgricultor, // Aquí se usa un solo ID de agricultor por registro
                'id_finca' => $request->id_finca,
                'id_trabajo' => $request->id_trabajo,
                'id_fito' => $idFitoToUse, // Se asigna el único ID de fitosanitario (o null)
                'id_usuario' => $request->id_usuario,
                'observaciones' => $request->observaciones,
                'fecha' => $fechaFormateada,
                'horas_trabajadas' => $request->horas_trabajadas,
            ]);

            $createdRecords[] = $registroTrabajo; // Añade el registro recién creado al array
        }

        return response()->json($createdRecords, 201); 
    }

    /**
     * Obtener datos para completar un registro de trabajo.
     */
    public function getDataForRegistroTrabajo(Request $request): JsonResponse
    {
        // Obtener Agricultores desde la tabla 'agricultores'
        $agricultores = Agricultores::all();  

        // Obtener Fincas
        $fincas = Fincas::all();
        
        // Obtener Trabajos
        $trabajos = Trabajos::all();  // Obtener todos los trabajos disponibles
        
        // Obtener Fitosanitarios
        $fitosanitarios = Fitos::all();  // Obtener todos los fitosanitarios disponibles
        
        // Devolver los datos en formato JSON
        return response()->json([
            'agricultores' => $agricultores,
            'fincas' => $fincas,
            'trabajos' => $trabajos,
            'fitosanitarios' => $fitosanitarios,
        ]);
    }

    /**
     * Obterner los dias en los que ha registrado un trabajado el usuario en especifico
     * */
    public function getDiasRegistroTrabajo(Request $request): JsonResponse
    {
        
        // Validar el ID del agricultor
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Obtener los días en los que el agricultor ha registrado un trabajo
        $diasRegistro = RegistroTrabajo::where('id_usuario', $request->id_usuario)
            ->select('fecha')
            ->distinct()
            ->get();

        // Formatear las fechas a YYYY-MM-DD antes de enviarlas
        $diasRegistroFormateados = $diasRegistro->map(function ($item) {
            $item->fecha = Carbon::parse($item->fecha)->format('Y-m-d');
            return $item;
        });

        return response()->json($diasRegistroFormateados);
    }

    /**
     * Obtener el nombre de los trabajos que se han registrado el dia X por el usuario X
     */
    public function getTrabajosPorDia(Request $request): JsonResponse
    {
        // Validar los datos de la petición
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer',
            'fecha' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Formatear la fecha para que coincida con el formato de la base de datos
        $fechaFormateada = Carbon::parse($request->fecha)->format('Y-m-d');

        // Obtener los trabajos registrados por el usuario en la fecha especificada
        $trabajos = RegistroTrabajo::where('id_usuario', $request->id_usuario)
            ->where('fecha', $fechaFormateada) // Usar la fecha formateada
            ->with('trabajo') // Cargar la relación con el modelo Trabajos
            ->get();

        return response()->json($trabajos);
    }

    /**
     * Obtener todos los registros de trabajo de un usuario.
     */
    public function getRegistroTrabajos($token): JsonResponse
    {
        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $id_usuario = Token::where('token', $token)->value('id_usuario');
        // Validar que el ID de usuario sea un número entero
        if (!is_numeric($id_usuario)) {
            return response()->json(['error' => 'El ID de usuario debe ser un número entero.'], 400);
        }

        // Obtener todos los registros de trabajo del usuario
        $registrosTrabajo = RegistroTrabajo::where('id_usuario', $id_usuario)
            ->with(['trabajo', 'usuario', 'agricultor']) // Cargar relaciones, incluyendo el agricultor
            ->get();

        return response()->json($registrosTrabajo);
    }
     
}
