<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registro_trabajos', function (Blueprint $table) {
            $table->id('id_registro');
            $table->foreignId('id_agricultor')->constrained('agricultores', 'id_agricultor')->onDelete('cascade');
            $table->foreignId('id_finca')->constrained('fincas', 'id_finca')->onDelete('cascade');
            $table->foreignId('id_trabajo')->constrained('trabajos', 'id_trabajo')->onDelete('cascade');
            $table->foreignId('id_fito')->nullable()->constrained('fitosanitarios', 'id_fito')->onDelete('set null');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->onDelete('cascade');
            $table->text('observaciones')->nullable();
            $table->date('fecha');
            $table->integer('horas_trabajadas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_trabajos');
    }
};