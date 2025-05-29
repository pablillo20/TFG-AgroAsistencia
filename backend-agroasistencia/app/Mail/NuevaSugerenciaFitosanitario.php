<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NuevaSugerenciaFitosanitario extends Mailable
{
    use Queueable, SerializesModels;

    public $sugerencia;
    public $userEmail; // Nueva propiedad para el email del usuario

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $sugerencia, string $userEmail)
    {
        $this->sugerencia = $sugerencia;
        $this->userEmail = $userEmail; // Asigna el email al la propiedad
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva Sugerencia de Fitosanitario',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.nueva_sugerencia', // Especifica la plantilla Markdown
            with: [
                'sugerencia' => $this->sugerencia,
                'userEmail' => $this->userEmail, // Pasa el email a la vista
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}