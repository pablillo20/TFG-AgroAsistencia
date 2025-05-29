<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Fitos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Mail\NuevaSugerenciaFitosanitario;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log; 


class FitoController extends Controller
{
    /*
     * Mostrar todos los fitosanitarios
     */
    public function index(): JsonResponse
    {
        // Si no hay registros en la tabla fitosanitarios
        if (!Fitos::exists()) {
            // Array con datos de 60 fitosanitarios
            $fitosanitarios = [
                ['tipo' => 'Insecticida', 'nombre' => 'Confidor'],
                ['tipo' => 'Insecticida', 'nombre' => 'Actara'],
                ['tipo' => 'Insecticida', 'nombre' => 'Decis'],
                ['tipo' => 'Insecticida', 'nombre' => 'Imidan'],
                ['tipo' => 'Insecticida', 'nombre' => 'Karate Zeon'],
                ['tipo' => 'Insecticida', 'nombre' => 'Movento'],
                ['tipo' => 'Insecticida', 'nombre' => 'Spintor'],
                ['tipo' => 'Insecticida', 'nombre' => 'Vertimec'],
                ['tipo' => 'Insecticida', 'nombre' => 'Belt'],
                ['tipo' => 'Insecticida', 'nombre' => 'Coragen'],
                ['tipo' => 'Fungicida', 'nombre' => 'Captan'],
                ['tipo' => 'Fungicida', 'nombre' => 'Topsin M'],
                ['tipo' => 'Fungicida', 'nombre' => 'Aliette'],
                ['tipo' => 'Fungicida', 'nombre' => 'Benlate'],
                ['tipo' => 'Fungicida', 'nombre' => 'Dithane'],
                ['tipo' => 'Fungicida', 'nombre' => 'Folpet'],
                ['tipo' => 'Fungicida', 'nombre' => 'Ridomil Gold'],
                ['tipo' => 'Fungicida', 'nombre' => 'Score'],
                ['tipo' => 'Fungicida', 'nombre' => 'Switch'],
                ['tipo' => 'Fungicida', 'nombre' => 'Ortiva'],
                ['tipo' => 'Herbicida', 'nombre' => 'Glifosato'],
                ['tipo' => 'Herbicida', 'nombre' => 'Roundup'],
                ['tipo' => 'Herbicida', 'nombre' => 'Gramoxone'],
                ['tipo' => 'Herbicida', 'nombre' => 'Gesaprim'],
                ['tipo' => 'Herbicida', 'nombre' => 'Fusilade'],
                ['tipo' => 'Herbicida', 'nombre' => 'Select'],
                ['tipo' => 'Herbicida', 'nombre' => 'Targa'],
                ['tipo' => 'Herbicida', 'nombre' => 'Banvel'],
                ['tipo' => 'Herbicida', 'nombre' => '2,4-D'],
                ['tipo' => 'Herbicida', 'nombre' => 'Atrazina'],
                ['tipo' => 'Acaricida', 'nombre' => 'Abamectina'],
                ['tipo' => 'Acaricida', 'nombre' => 'Envidor'],
                ['tipo' => 'Acaricida', 'nombre' => 'Milbeknock'],
                ['tipo' => 'Acaricida', 'nombre' => 'Oberon'],
                ['tipo' => 'Acaricida', 'nombre' => 'Sanmite'],
                ['tipo' => 'Nematicida', 'nombre' => 'Vydate'],
                ['tipo' => 'Nematicida', 'nombre' => 'Nemacur'],
                ['tipo' => 'Nematicida', 'nombre' => 'Telone'],
                ['tipo' => 'Nematicida', 'nombre' => 'Velum Prime'],
                ['tipo' => 'Nematicida', 'nombre' => 'Mocap'],
                ['tipo' => 'Regulador de Crecimiento', 'nombre' => 'Etefon'],
                ['tipo' => 'Regulador de Crecimiento', 'nombre' => 'Cycocel'],
                ['tipo' => 'Regulador de Crecimiento', 'nombre' => 'Paclobutrazol'],
                ['tipo' => 'Regulador de Crecimiento', 'nombre' => 'Moddus'],
                ['tipo' => 'Regulador de Crecimiento', 'nombre' => 'Trinexapac-etil'],
                ['tipo' => 'Molusquicida', 'nombre' => 'Metaldehído'],
                ['tipo' => 'Molusquicida', 'nombre' => 'Mesurol'],
                ['tipo' => 'Molusquicida', 'nombre' => 'Sluggo'],
                ['tipo' => 'Molusquicida', 'nombre' => 'Deadline'],
                ['tipo' => 'Molusquicida', 'nombre' => 'Iron Phosphate'],
                ['tipo' => 'Bactericida', 'nombre' => 'Cobre'],
                ['tipo' => 'Bactericida', 'nombre' => 'Estreptomicina'],
                ['tipo' => 'Bactericida', 'nombre' => 'Oxitetraciclina'],
                ['tipo' => 'Bactericida', 'nombre' => 'Kasugamicina'],
                ['tipo' => 'Bactericida', 'nombre' => 'Ácido Oxolínico'],
                ['tipo' => 'Adyuvante', 'nombre' => 'Aceite Agrícola'],
                ['tipo' => 'Adyuvante', 'nombre' => 'Tensioactivo'],
                ['tipo' => 'Adyuvante', 'nombre' => 'Esparcidor'],
                ['tipo' => 'Adyuvante', 'nombre' => 'Penetrante'],
                ['tipo' => 'Adyuvante', 'nombre' => 'Antiespumante'],
            ];
            // Insertar los fitosanitarios en la base de datos
            try {
                Fitos::insert($fitosanitarios);
            } catch (\Exception $e) {
                Log::error('Error al insertar fitosanitarios iniciales: ' . $e->getMessage());
                return response()->json(['error' => 'Error al inicializar la base de datos de fitosanitarios.'], 500);
            }
        }
        $fitos = Fitos::all();
        return response()->json($fitos);
    }

    /*
     * Sugerencia Fitosanitarios
     */
    public function sugerencias(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sugerencia' => 'required|string|min:3',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sugerenciaTexto = $request->input('sugerencia');
        $userEmail = $request->input('email');

        try {
            // Pasar $userEmail al constructor del Mailable
            Mail::to(env('MAIL_ADMIN'))
                ->send(new NuevaSugerenciaFitosanitario($sugerenciaTexto, $userEmail));
        } catch (\Exception $e) {
            Log::error('Error al enviar correo electrónico: ' . $e->getMessage());
            return response()->json(['error' => 'Error al enviar la sugerencia. Por favor, inténtelo de nuevo.'], 500);
        }

        return response()->json(['message' => 'Sugerencia enviada correctamente.'], 200);
    }

    /*
    * Top 3 fitosanitarios más utilizados en la tabla registro de trabajos
    */
    public function topFitosanitarios()
    {
        $topFitosanitarios = Fitos::select('fitosanitarios.nombre', \DB::raw('COUNT(*) as total'))
            ->join('registro_trabajos', 'registro_trabajos.id_fito', '=', 'fitosanitarios.id_fito')
            ->groupBy('fitosanitarios.nombre')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        if ($topFitosanitarios->isEmpty()) {
            return response()->json(['message' => 'Ningún agricultor ha utilizado fitos hasta el momento.'], 200);
        }

        return response()->json($topFitosanitarios);
    }


}

