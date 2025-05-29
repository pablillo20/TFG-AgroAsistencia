<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agricultores extends Model
{
    use HasFactory;

    protected $table = 'agricultores';

    protected $primaryKey = 'id_agricultor';

    protected $fillable = [
        'DNI',
        'nombre',
        'apellidos',
        'telefono',
        'localidad'
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

}
