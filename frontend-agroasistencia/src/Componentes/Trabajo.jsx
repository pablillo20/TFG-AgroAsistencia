import React, { useState, useEffect } from "react";
import "../Style/Trabajo.css";
import Carga from "../../public/carga.gif";

const API_BASE_URL = "https://agroasistencia.es/api";

const Trabajo = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    id_maquinaria: "",
  });
  const [maquinarias, setMaquinarias] = useState([]);
  const [maquinariaSearch, setMaquinariaSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrabajos();
    fetchMaquinarias();
  }, []);

  const fetchTrabajos = async () => {
    const token = localStorage.getItem("authToken"); 
    if (!token) {
      setError("No se encontró el token de autenticación. Por favor, inicia sesión.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/trabajos/${token}`);
      const data = await res.json();
      setTrabajos(Array.isArray(data) ? data : []);
    } catch (err) { 
      setError("Error al cargar trabajos.");
      console.error("Error al obtener trabajos:", err); 
    }
  };

  const fetchMaquinarias = async () => {
    const token = localStorage.getItem("authToken"); 
    if (!token) {
      setError("No se encontró el token de autenticación. Por favor, inicia sesión.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/maquinaria/${token}`);
      const data = await res.json();
      setMaquinarias(Array.isArray(data) ? data : []);
    } catch (err) { // Capturar el objeto de error
      setError("Error al cargar maquinarias.");
      console.error("Error al obtener maquinarias:", err); 
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre) {
      setError("El nombre del trabajo es obligatorio.");
      return;
    }

    const token = localStorage.getItem("authToken"); // Obtener token aquí antes de hacer la solicitud
    if (!token) {
      setError("No se encontró el token de autenticación. Por favor, inicia sesión.");
      return;
    }

    // Preparar los datos a enviar.
    // El método `store` del backend obtendrá `id_usuario` del token,
    // así que no lo incluimos en el cuerpo de la solicitud.
    const requestBody = {
      nombre: formData.nombre,
    };
    if (formData.id_maquinaria) {
      requestBody.id_maquinaria = formData.id_maquinaria;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/trabajos/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // Enviar como cadena JSON
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          nombre: "",
          id_maquinaria: "",
        });
        setMaquinariaSearch("");
        fetchTrabajos();
        setError(null);
      } else {
        setError(data.message || "Error al registrar trabajo.");
      }
    } catch (err) { // Capturar el objeto de error
      setError("Error al enviar los datos.");
      console.error("Error al enviar el trabajo:", err); 
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este trabajo? Si se elimina, perderá todos los registros de trabajo asociados a este."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken"); // Obtener token antes de hacer la solicitud
    if (!token) {
      setError("No se encontró el token de autenticación. Por favor, inicia sesión.");
      return;
    }

    try {
      // Pasar el token como parámetro de consulta para DELETE
      const res = await fetch(`${API_BASE_URL}/trabajos/${id}?token=${token}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchTrabajos();
      } else {
        setError(data.message || "Error al eliminar trabajo.");
      }
    } catch (err) { // Capturar el objeto de error
      setError("Error al eliminar trabajo.");
      console.error("Error al eliminar el trabajo:", err); 
    }
  };

  const toggleMaquinariaSeleccionada = (id) => {
    setFormData((prev) => ({
      ...prev,
      id_maquinaria: prev.id_maquinaria === String(id) ? "" : String(id),
    }));
  };

  return (
    <div className="trabajo-container">
      <div className="trabajo-listado">
        <h2>Listado de Trabajos</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="trabajo-scroll">
          {trabajos.length > 0 ? (
            trabajos.map((trabajo) => (
              <div key={trabajo.id_trabajo} className="trabajo-item">
                <p>
                  <strong>Nombre:</strong> {trabajo.nombre}
                </p>
                {/** 
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(trabajo.id_trabajo)}
                >
                  Eliminar
                </button>
                */}
              </div>
            ))
          ) : (
            <p>No hay trabajos registrados.</p>
          )}
        </div>
      </div>

      <div className="trabajo-formulario">
        <h2>Registrar Trabajo</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del Trabajo:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Buscar Maquinaria:
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={maquinariaSearch}
              onChange={(e) => setMaquinariaSearch(e.target.value)}
            />
          </label>

          <div className="maquinaria-list-scroll">
            {maquinarias
              .filter((m) =>
                m.nombre.toLowerCase().includes(maquinariaSearch.toLowerCase())
              )
              .map((m) => (
                <div
                  key={m.id_maquinaria}
                  className={`maquinaria-card ${
                    formData.id_maquinaria === String(m.id_maquinaria)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleMaquinariaSeleccionada(m.id_maquinaria)}
                >
                  {m.nombre}
                </div>
              ))}
          </div>

          <button className="btn" type="submit">
            Guardar Trabajo
          </button>
        </form>
      </div>
    </div>
  );
};

export default Trabajo;