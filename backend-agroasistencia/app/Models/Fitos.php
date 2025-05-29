<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fitos extends Model
{
    use HasFactory;

    protected $table = 'fitosanitarios';

    protected $primaryKey = 'id_fito';

    protected $fillable = [
        'tipo',
        'nombre',
    ];
}
