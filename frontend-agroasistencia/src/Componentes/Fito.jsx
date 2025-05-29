import React, { useState, useEffect } from "react";
import Carga from "../../public/carga.gif";
import "../Style/fitosanitarios.css";

export default function Fitosanitarios() {
  const [fitosanitarios, setFitosanitarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sugerencia, setSugerencia] = useState("");
  const [enviandoSugerencia, setEnviandoSugerencia] = useState(false);
  const [mensajeSugerencia, setMensajeSugerencia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null); 

  useEffect(() => {
    async function fetchFitosanitarios() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://agroasistencia.es/api/fitosanitarios");
        if (!res.ok) {
          throw new Error("Error al cargar fitosanitarios");
        }
        const data = await res.json();
        setFitosanitarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFitosanitarios();
  }, []);

  // Función para obtener el token desde localStorage
  const obtenerToken = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem("authToken");
        resolve(token);
      }, 0);
    });
  };

  const handleSugerenciaChange = (e) => {
    setSugerencia(e.target.value);
  };

  const handleSubmitSugerencia = async (e) => {
    e.preventDefault();
    if (!sugerencia.trim()) {
      setMensajeSugerencia({
        tipo: "error",
        texto: "Por favor, introduce tu sugerencia.",
      });
      return;
    }

    setEnviandoSugerencia(true);
    setMensajeSugerencia(null);

    try {
      // Obtenemos el token
      const tokenObtenido = await obtenerToken();
      setToken(tokenObtenido);

      // 1. Obtenemos el email usando el token
      const resEmail = await fetch(
        `https://agroasistencia.es/api/usuarios/email/token/${tokenObtenido}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!resEmail.ok) {
        const errorDataEmail = await resEmail.json();
        throw new Error(
          errorDataEmail.message || "Error al obtener el email del usuario."
        );
      }

      const dataEmail = await resEmail.json();
      const userEmail = dataEmail.email; // Suponiendo que la respuesta tiene un campo 'email'
      setEmail(userEmail); // Guardamos el email en el estado

      // 2. Enviamos la sugerencia usando el email
      const resSugerencia = await fetch(
        "https://agroasistencia.es/api/fitosanitarios/sugerencias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sugerencia, email: userEmail }), // Incluimos el email en el body
        }
      );

      if (!resSugerencia.ok) {
        const errorDataSugerencia = await resSugerencia.json();
        throw new Error(
          errorDataSugerencia.message || "Error al enviar la sugerencia."
        );
      }

      setSugerencia("");
      setMensajeSugerencia({
        tipo: "success",
        texto: "¡Gracias! Tu sugerencia ha sido enviada.",
      });
    } catch (err) {
      setMensajeSugerencia({ tipo: "error", texto: err.message });
    } finally {
      setEnviandoSugerencia(false);
    }
  };

  // Función para normalizar el texto (quitar tildes y convertir a minúsculas)
  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtra los fitosanitarios basados en el término de búsqueda normalizado
  const filteredFitosanitarios = fitosanitarios.filter((fito) => {
    const nombreNormalizado = normalizeText(fito.nombre);
    const tipoNormalizado = normalizeText(fito.tipo);
    const searchTermNormalizado = normalizeText(searchTerm);

    return (
      nombreNormalizado.includes(searchTermNormalizado) ||
      tipoNormalizado.includes(searchTermNormalizado)
    );
  });

  if (loading)
    return (
      <div className="contenedor-carga">
        <img src={Carga} alt="Cargando..." className="gif-carga" />
      </div>
    );
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="fitosanitarios-manager-container">
      <div className="fitosanitarios-list-container">
        <h2>Lista de Fitosanitarios</h2>
        {/* Barra de búsqueda */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-full md:w-80"
          />
        </div>

        {filteredFitosanitarios.length > 0 ? (
          <table className="fitosanitarios-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {filteredFitosanitarios.map((fito) => (
                <tr key={fito.id_fitosanitario}>
                  <td>{fito.tipo}</td>
                  <td>{fito.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">
            No hay fitosanitarios disponibles con ese criterio.
          </p>
        )}
      </div>

      <div className="sugerencia-form-container">
        <h2>¿Falta algún fitosanitario?</h2>
        <p className="sugerencia-info">
          Coméntanoslo y lo revisaremos para incluirlo en nuestra base de datos.
        </p>
        <form onSubmit={handleSubmitSugerencia} className="sugerencia-form">
          <div className="form-group">
            <label htmlFor="sugerencia">Tu sugerencia:</label>
            <textarea
              id="sugerencia"
              name="sugerencia"
              value={sugerencia}
              onChange={handleSugerenciaChange}
              rows="5"
              placeholder="Escribe aquí el nombre del fitosanitario que falta..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={enviandoSugerencia}
            className="btn-sugerencia"
          >
            {enviandoSugerencia ? "Enviando..." : "Enviar sugerencia"}
          </button>
          {mensajeSugerencia && (
            <p
              className={
                mensajeSugerencia.tipo === "error" ? "error-text" : "success-text"
              }
            >
              {mensajeSugerencia.texto}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

