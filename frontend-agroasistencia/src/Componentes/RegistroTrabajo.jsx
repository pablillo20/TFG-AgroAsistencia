import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/registrotrabajo.css";
import Carga from "../../public/carga.gif";
import Select from "react-select";

function RegistroTrabajoForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const fechaParam = params.get("fecha");
  const token = localStorage.getItem("authToken");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    id_agricultores: [],
    id_finca: "",
    id_trabajo: "",
    id_fito: "",
    observaciones: "",
    horas_trabajadas: "",
    fecha: fechaParam || new Date().toLocaleDateString("en-CA"),
    id_usuario: null,
  });

  const [dataOptions, setDataOptions] = useState({
    agricultores: [],
    fincas: [],
    trabajos: [],
    fitosanitarios: [],
  });

  const [filteredFincas, setFilteredFincas] = useState([]);
  const [filteredTrabajos, setFilteredTrabajos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const obtenerUserIdDesdeToken = async () => {
      try {
        const res = await fetch(
          `https://agroasistencia.es/api/usuarios/token/${token}`
        );
        if (!res.ok) {
          throw new Error(`Error al obtener usuario desde token. Status: ${res.status}`);
        }
        const data = await res.json();
        setCurrentUserId(data.id_usuario);
      } catch (error) {
        console.error("Error obteniendo el ID del usuario:", error);
        setCurrentUserId(null);
        navigate("/login");
      }
    };
    obtenerUserIdDesdeToken();
  }, [token, navigate]);

  useEffect(() => {
    if (currentUserId) {
      setFormData((prev) => ({ ...prev, id_usuario: currentUserId }));
    }
  }, [currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://agroasistencia.es/api/registro_trabajo", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`https error! status: ${res.status}`);
        }
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setDataOptions({
            agricultores: data.agricultores || [],
            fincas: data.fincas || [],
            trabajos: data.trabajos || [],
            fitosanitarios: data.fitosanitarios || [],
          });
        } else {
          throw new Error(`Respuesta no es JSON. Content-Type: ${contentType}`);
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentUserId && dataOptions.fincas) {
      const fincasFiltradas = dataOptions.fincas.filter(
        (finca) => finca.id_usuario === parseInt(currentUserId, 10)
      );
      setFilteredFincas(fincasFiltradas);
    }
  }, [currentUserId, dataOptions.fincas]);

  useEffect(() => {
    if (currentUserId && dataOptions.trabajos) {
      const trabajosFiltrados = dataOptions.trabajos.filter(
        (trabajo) => trabajo.id_usuario === parseInt(currentUserId, 10)
      );
      setFilteredTrabajos(trabajosFiltrados);
    }
  }, [currentUserId, dataOptions.trabajos]);

  const handleAgricultoresChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      id_agricultores: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleFitosanitariosChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      id_fito: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    if (!currentUserId) {
      setError("No se ha identificado el usuario. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    const finalDataToSend = {
      ...formData,
      id_usuario: currentUserId,
      id_fitos: formData.id_fito ? [formData.id_fito] : null,
      id_fito: undefined,
    };

    try {
      const res = await fetch("https://agroasistencia.es/api/registro_trabajo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDataToSend),
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(". ");
          setError(`Error de validación: ${errorMessages}`);
        } else {
          throw new Error(errorData.message || "Error al enviar el formulario.");
        }
      } else {
        setMensaje("Trabajo registrado correctamente.");
        setTimeout(() => navigate("/calendario"), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="contenedor-carga">
        <img src={Carga} alt="Cargando..." className="gif-carga" />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const fitoSelectValue = formData.id_fito
    ? dataOptions.fitosanitarios.find((fito) => fito.id_fito === formData.id_fito)
      ? {
          value: formData.id_fito,
          label: dataOptions.fitosanitarios.find((fito) => fito.id_fito === formData.id_fito)?.nombre,
        }
      : null
    : null;

  return (
    <div className="form-container">
      <h2 className="form-title">
        Registrar Trabajo - {new Date(formData.fecha).toLocaleDateString()}
      </h2>
      {mensaje && <p className="success-message">{mensaje}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="id_agricultores" className="form-label">Agricultores:</label>
          <Select
            isMulti
            name="id_agricultores"
            value={dataOptions.agricultores
              .filter((a) => formData.id_agricultores.includes(a.id_agricultor))
              .map((a) => ({ value: a.id_agricultor, label: `${a.nombre} ${a.apellidos}` }))
            }
            onChange={handleAgricultoresChange}
            options={dataOptions.agricultores.map((a) => ({
              value: a.id_agricultor,
              label: `${a.nombre} ${a.apellidos}`,
            }))}
            className="form-select"
            classNamePrefix="react-select"
            placeholder="Selecciona uno o varios agricultores"
            noOptionsMessage={() => "No hay agricultores disponibles"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_finca" className="form-label">Finca:</label>
          <select
            name="id_finca"
            value={formData.id_finca}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">
              {filteredFincas.length === 0 ? "No hay fincas disponibles" : "Selecciona"}
            </option>
            {filteredFincas.map((f) => (
              <option key={f.id_finca} value={f.id_finca}>{f.nombre}</option>
            ))}
          </select>
          {filteredFincas.length === 0 && (
            <p className="no-fincas-message">
              No tienes fincas registradas.{" "}
              <a href="/Fincas" className="link-crear-finca">Crear finca</a>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="id_trabajo" className="form-label">Trabajo:</label>
          <select
            name="id_trabajo"
            value={formData.id_trabajo}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Selecciona</option>
            {filteredTrabajos.map((t) => (
              <option key={t.id_trabajo} value={t.id_trabajo}>{t.nombre}</option>
            ))}
          </select>
          {filteredTrabajos.length === 0 && (
            <p className="no-trabajos-message">
              No tienes trabajos registrados.{" "}
              <a href="/trabajo" className="link-crear-trabajo">Crear trabajo</a>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="id_fito" className="form-label">Fitosanitario (opcional):</label>
          <Select
            name="id_fito"
            value={fitoSelectValue}
            onChange={handleFitosanitariosChange}
            options={dataOptions.fitosanitarios.map((f) => ({
              value: f.id_fito,
              label: f.nombre,
            }))}
            isClearable
            className="form-select"
            classNamePrefix="react-select"
            placeholder="Selecciona un fitosanitario"
            noOptionsMessage={() => "No hay fitosanitarios disponibles"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="observaciones" className="form-label">Observaciones:</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="horas_trabajadas" className="form-label">Horas trabajadas:</label>
          <input
            type="number"
            name="horas_trabajadas"
            value={formData.horas_trabajadas}
            onChange={handleChange}
            required
            min="0"
            step="0.5"
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="form-button">
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default RegistroTrabajoForm;
