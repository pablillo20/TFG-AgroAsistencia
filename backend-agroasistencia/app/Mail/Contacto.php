<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Contacto extends Mailable
{
    use Queueable, SerializesModels;

    public $sugerencia;
    public $userEmail; 

    public $nombre; 

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $sugerencia, string $userEmail, string $nombre)
    {
        $this->sugerencia = $sugerencia;
        $this->userEmail = $userEmail; 
        $this->nombre = $nombre;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva Mensaje de Contacto',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.nuevo_contacto', 
            with: [
                'mensaje' => $this->sugerencia,
                'userEmail' => $this->userEmail, 
                'nombre' => $this->nombre
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