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
        Schema::create('trabajos', function (Blueprint $table) {
            $table->id('id_trabajo');
            $table->string('nombre');
            $table->foreignId('id_maquinaria')->nullable()->constrained('maquinaria', 'id_maquinaria')->onDelete('set null');
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios', 'id_usuario')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajos');
    }
};
