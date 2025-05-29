import React, { useState, useEffect } from "react";
import "../Style/Contacto.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [error, setError] = useState("");
  const [estadoEnvio, setEstadoEnvio] = useState("");
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  // Manejar cambios en los inputs del formulario
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError("");
    setEstadoEnvio("Enviando...");

    // Enviar los datos del formulario a tu API de Laravel
    try {
      const response = await fetch("https://agroasistencia.es/api/sugerencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          setError("Error de validación. Por favor, corrige los campos.");
          console.log(errorData.errores);
        } else {
          setError(
            "Fallo al enviar el mensaje. Por favor, inténtalo de nuevo."
          );
        }
        setEstadoEnvio("");
        return;
      }

      const responseData = await response.json();
      console.log("Respuesta de la API:", responseData); // Muestra la respuesta de la API
      setEstadoEnvio(responseData.mensaje); // Usa el mensaje de la API
      setFormData({ nombre: "", email: "", mensaje: "" }); // Limpia el formulario
    } catch (err) {
      setError("Error de red. Por favor, inténtalo de nuevo.");
      setEstadoEnvio("");
      console.error(err);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contáctanos</h1>
      <p>
        ¡Nos encantaría escucharte! Por favor, rellena el siguiente formulario.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>

        {error && <p className="error-text">{error}</p>}
        {estadoEnvio && <p className="submit-status">{estadoEnvio}</p>}

        <button
          type="submit"
          className="btn-submit"
          disabled={estadoEnvio === "Enviando..."}
        >
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
