<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fincas extends Model
{
    use HasFactory;

    protected $table = 'fincas';

    protected $primaryKey = 'id_finca';

    protected $fillable = [
        'id_usuario', 
        'nombre',
        'ubicacion',
        'hectareas',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    
}
