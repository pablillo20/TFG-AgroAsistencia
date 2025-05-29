<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{

    /**
     * Mostrar todos los usuarios.
     */
    public function index(): JsonResponse
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    /**
     * Insertar un nuevo usuario en la base de datos.
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
        ];

        // Validar los datos de la petición
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios',
            'contraseña' => 'required|string|min:8',
            'apellidos' => 'nullable|string|max:255',
            'DNI' => 'nullable|string|max:20|unique:usuarios',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
        ], $mensajes);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear el nuevo usuario
        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'DNI' => $request->DNI,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'contraseña' => Hash::make($request->contraseña),
        ]);

        // Insertar en la tabla tokens un numero aleatorio asignado a la id de este usuario
        $token = new Token();
        $token->id_usuario = $usuario->id_usuario;
        $token->token = bin2hex(random_bytes(16)); // Genera un token aleatorio
        $token->save();
        
        // Retornar el usuario creado con su id y el token
        return response()->json([
            'usuario' => $usuario,
            'id_usuario' => $usuario->id_usuario,
            'token' => $token->token,
        ], 201);
    }

    /**
     * Actualizar un usuario existente en la base de datos.
     */
    public function update(Request $request, $token): JsonResponse
    {

        // Obtener el id de usuario del token, mirando en la tabla tokens cual es el id_usuario de ese token
        $id = Token::where('token', $token)->value('id_usuario');
        
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'max' => 'El campo :attribute no debe superar los :max caracteres.',
            'email' => 'El campo :attribute debe ser un correo electrónico válido.',
            'unique' => 'El campo :attribute ya está en uso.',
        ];

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:usuarios,email,' . $id . ',id_usuario',
            ],
            'apellidos' => 'required|string|max:255',
            'DNI' => [
                'required',
                'string',
                'max:20',
                'unique:usuarios,DNI,' . $id . ',id_usuario',
            ],
            'telefono' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
        ], $mensajes);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->nombre = $request->nombre;
        $usuario->apellidos = $request->apellidos;
        $usuario->email = $request->email;
        $usuario->DNI = $request->DNI;
        $usuario->telefono = $request->telefono;
        $usuario->direccion = $request->direccion;

        $usuario->save();

        return response()->json($usuario, 200);
    }

    /**
     * Logear un usuario existente en la base de datos.
     */
    public function login(Request $request): JsonResponse
    {
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'email' => 'El campo :attribute debe ser un correo electrónico válido.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'contraseña' => 'required|string|min:8',
        ], $mensajes);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->contraseña, $usuario->contraseña)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Obtener el token del usuario
        $token = Token::where('id_usuario', $usuario->id_usuario)->first();
        // Retornar el usuario logueado con su id y el token
        return response()->json([
            'usuario' => $usuario,
            'id_usuario' => $usuario->id_usuario,
            'token' => $token->token,
        ], 200);
    }
    /**
     * Obtener id a través del email.
     */
    public function getIdByEmail(Request $request, $mail): JsonResponse
    {
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'email' => 'El campo :attribute debe ser un correo electrónico válido.',
        ];

        $validator = Validator::make(
            ['email' => $mail], // Usa el parámetro $mail directamente
            [
                'email' => 'required|string|email|max:255',
            ],
            $mensajes
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario = Usuario::where('email', $mail)->first(); // Usa $mail

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json(['id_usuario' => $usuario->id_usuario], 200);
    }

    /**
     * Buscar id Usuario por Token
     */

    public function getIdByToken(Request $request, $token): JsonResponse
    {
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
        ];

        $validator = Validator::make(
            ['token' => $token], // Usa el parámetro $token directamente
            [
                'token' => 'required|string',
            ],
            $mensajes
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tokenRecord = Token::where('token', $token)->first(); // Usa $token

        if (!$tokenRecord) {
            return response()->json(['message' => 'Token no encontrado'], 404);
        }

        return response()->json(['id_usuario' => $tokenRecord->id_usuario], 200);
    }

    /**
     * Obtener token por email
     */

    public function getTokenByEmail(Request $request, $email): JsonResponse
    {
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'email' => 'El campo :attribute debe ser un correo electrónico válido.',
        ];

        $validator = Validator::make(
            ['email' => $email], 
            [
                'email' => 'required|string|max:255',
            ],
            $mensajes
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario = Usuario::where('email', $email)->first(); // Usa $email

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $token = Token::where('id_usuario', $usuario->id_usuario)->first();

        if (!$token) {
            return response()->json(['message' => 'Token no encontrado'], 404);
        }

        return response()->json(['token' => $token->token], 200);
    }

    /**
     * Obtener email por token
     */
    public function getEmailByToken(Request $request, $token): JsonResponse
    {
        $mensajes = [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
        ];

        $validator = Validator::make(
            ['token' => $token], 
            [
                'token' => 'required|string',
            ],
            $mensajes
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tokenRecord = Token::where('token', $token)->first(); // Usa $token

        if (!$tokenRecord) {
            return response()->json(['message' => 'Token no encontrado'], 404);
        }

        $usuario = Usuario::find($tokenRecord->id_usuario);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json(['email' => $usuario->email], 200);
    }

}
