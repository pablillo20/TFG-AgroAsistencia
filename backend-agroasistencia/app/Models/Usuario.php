<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    
    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    
    protected $fillable = [
        'nombre',
        'apellidos',
        'email',
        'DNI',
        'telefono',
        'direccion',
        'contraseña',
    ];

    protected $hidden = [
        'contraseña',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'contraseña' => 'hashed',
    ];
}