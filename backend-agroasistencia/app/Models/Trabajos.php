<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trabajos extends Model
{
    use HasFactory;

    protected $table = 'trabajos';

    protected $primaryKey = 'id_trabajo';

    protected $fillable = [
        'nombre',
        'id_maquinaria', 
        'id_usuario',
    ];

    
}
