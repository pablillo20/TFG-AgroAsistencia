<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroTrabajo extends Model
{
    use HasFactory;

    protected $table = 'registro_trabajos';

    protected $primaryKey = 'id_registro';

    protected $fillable = [
        'id_agricultor',
        'id_finca',
        'id_trabajo',
        'id_fito',
        'id_usuario',
        'observaciones',
        'fecha',
        'horas_trabajadas',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'fecha',
    ];

    public function trabajo()
    {
        return $this->belongsTo(Trabajos::class, 'id_trabajo'); 
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function agricultor()
    {
        return $this->belongsTo(Agricultores::class, 'id_agricultor');
    }

}
