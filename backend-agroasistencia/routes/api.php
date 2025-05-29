<?php

use App\Http\Controllers\ContactoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RegistroTrabajoController;
use App\Http\Controllers\FincasController;
use App\Http\Controllers\FitoController;
use App\Http\Controllers\AgricultorController;
use App\Http\Controllers\MaquinariaController;
use App\Http\Controllers\TrabajoController;
use App\Http\Controllers\Contacto;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// USUARIOS

// OBTENER TODOS LOS USUARIOS
Route::get('/usuarios', [UsuarioController::class, 'index']);

// CREAR UN NUEVO USUARIO
Route::post('/usuarios', [UsuarioController::class, 'store']);

// ACTUALIZAR UN USUARIO EXISTENTE
Route::post('/usuarios/{token}', [UsuarioController::class, 'update']);

// Login de un usuario
Route::post('/login', [UsuarioController::class, 'login']);

// Obtener id de usuario por Email
Route::get('/usuarios/{email}', [UsuarioController::class, 'getIdByEmail']);

// Obtener id de usuario por Token
Route::get('/usuarios/token/{token}', [UsuarioController::class, 'getIdByToken']);

// Obtener el email por Token
Route::get('/usuarios/email/token/{token}', [UsuarioController::class, 'getEmailByToken']);

// Obtener el token por mail
Route::get('/usuarios/token/email/{email}', [UsuarioController::class, 'getTokenByEmail']);

////////////////////////////////////////////////////////////////////////////////////////////////////

// REGISTRO DE TRABAJO

// CRAR UN REGISTRO DE TRABAJO
Route::post('/registro_trabajo', [RegistroTrabajoController::class, 'store']);

// DAR DATOS PARA COMPLETAR UN REGISTRO DE TRABAJO
Route::get('/registro_trabajo', [RegistroTrabajoController::class, 'getDataForRegistroTrabajo']);

// Obteber los dias que el usuario ha registrado un trabajo
Route::get('/registro_trabajo/dias', [RegistroTrabajoController::class, 'getDiasRegistroTrabajo']);

// Obtener los trabajos que se han registrado el dia X por el usuario X
Route::get('/registro_trabajo/trabajos', [RegistroTrabajoController::class, 'getTrabajosPorDia']);

// Obtener todos los registros de trabajo de un usuario
Route::get('/registro_trabajo/{token}', [RegistroTrabajoController::class, 'getRegistroTrabajos']);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// AGRICULTORES

// Mostrar todos los agricultores
Route::get('/agricultores', [App\Http\Controllers\AgricultorController::class, 'index']);

// Crear un agricultor
Route::post('/agricultores', [App\Http\Controllers\AgricultorController::class, 'store']);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// FINCAS

// Mostrar todas las fincas
Route::get('/fincas', [App\Http\Controllers\FincasController::class, 'index']);

// Registrar Finca
Route::post('/fincas', [App\Http\Controllers\FincasController::class, 'store']);

// Editar Finca
Route::put('/fincas/{id_finca}', [App\Http\Controllers\FincasController::class, 'update']);

// Mostrar una finca por ID
Route::get('/fincas/usuario/{token}', [App\Http\Controllers\FincasController::class, 'show']);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// FITOSANITARIOS

// Mostrar todos los fitosanitarios
Route::get('/fitosanitarios',  [App\Http\Controllers\FitoController::class, 'index']);

// Sugerencias de fitosanitarios

Route::post('/fitosanitarios/sugerencias',  [App\Http\Controllers\FitoController::class, 'sugerencias']);

// Top fitosanitarios

Route::get('/fitosanitariosTop',  [App\Http\Controllers\FitoController::class, 'topFitosanitarios']);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Maquinaria

// Mostrar maquinaria por usuario
Route::get('/maquinaria/{token}', [MaquinariaController::class, 'mostrarMaquinaria']);

// Crear maquinaria
Route::post('/maquinaria/{token}', [MaquinariaController::class, 'crearMaquinaria']);

// Actualizar maquinaria
Route::put('/maquinaria/{id_maquinaria}', [MaquinariaController::class, 'actualizarMaquinaria']); 

// Borrar maquinaria
Route::delete('/maquinaria/{id_maquinaria}/eliminar', [MaquinariaController::class, 'borrarMaquinaria']); 


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Trabajos

// Crear trabajo
Route::post('/trabajos/{token}', [TrabajoController::class, 'store']);    

// Mostrar trabajos del usuario
Route::get('/trabajos/{token}', [TrabajoController::class, 'index']);        

// Mostrar trabajo por ID
Route::get('/trabajos/{trabajo}', [TrabajoController::class, 'show']);  

// Eliminar trabajo
Route::delete('/trabajos/{trabajo}', [TrabajoController::class, 'destroy']); 



///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Contacto

Route::post('/sugerencia', [ContactoController::class, 'enviarSugerencia']);