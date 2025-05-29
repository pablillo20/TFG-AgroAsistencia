<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maquinaria extends Model
{
    use HasFactory;

    protected $table = 'maquinaria';

    protected $primaryKey = 'id_maquinaria';

    protected $fillable = [
        'id_usuario', 
        'nombre',
        'año',
        'marca',
        'modelo',
        'numero_serie'
    ];

}
