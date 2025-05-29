import React, { useState, useEffect } from "react";
import "../Style/Maquinaria.css";
import Carga from "../../public/carga.gif"; 

const API_BASE_URL = "https://agroasistencia.es/api";

const MaquinariaManager = () => {
  const [maquinaria, setMaquinaria] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    id_maquinaria: null,
    año: "",
    marca: "",
    modelo: "",
    numero_serie: "",
  });
  const [error, setError] = useState(null);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState(null);

  useEffect(() => {
    fetchMaquinaria();
  }, []);

 

  const fetchMaquinaria = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // Asegúrate de que el token se envía en la URL para la obtención
      const response = await fetch(`${API_BASE_URL}/maquinaria/${token}`);
      const data = await response.json();
      setMaquinaria(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching maquinaria:", err);
      setError("Error al cargar la maquinaria.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Validaciones de formulario
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!formData.año) {
      setError("El año es obligatorio.");
      return;
    }
    if (!formData.marca) {
      setError("La marca es obligatoria.");
      return;
    }
    if (!formData.modelo) {
      setError("El modelo es obligatorio.");
      return;
    }
    if (!formData.numero_serie) {
      setError("El número de serie es obligatorio.");
      return;
    }

    const isEditing = !!formData.id_maquinaria;
    let url = isEditing
      ? `${API_BASE_URL}/maquinaria/${formData.id_maquinaria}`
      : `${API_BASE_URL}/maquinaria`;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No se encontró el token de autenticación. Por favor, inicia sesión.");
      return;
    }

    const requestData = new FormData();
    requestData.append("nombre", formData.nombre);
    // Ya no se envía id_usuario desde aquí, el backend lo obtendrá del token
    requestData.append("año", formData.año);
    requestData.append("marca", formData.marca);
    requestData.append("modelo", formData.modelo);
    requestData.append("numero_serie", formData.numero_serie);

    // Si estás editando, el método es PUT y lo envías como _method en FormData
    if (isEditing) {
      requestData.append("_method", "PUT");
    } else {
        // ajustamos la URL para incluir el token para la creación.
        url = `${API_BASE_URL}/maquinaria/${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST", 
        body: requestData,
      });

      const result = await response.json();
      console.log("📦 Respuesta del backend:", result);

      if (response.ok) {
        fetchMaquinaria();
        resetForm();
      } else {
        setError(result.message || "Error al guardar la maquinaria.");
      }
    } catch (err) {
      console.error("❌ Error al enviar los datos:", err);
      setError("Error al enviar los datos.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre,
      id_maquinaria: item.id_maquinaria,
      año: item.año,
      marca: item.marca,
      modelo: item.modelo,
      numero_serie: item.numero_serie,
    });
    setFormVisible(true);
  };

  const handleDelete = async (id_maquinaria) => {
    const confirm = window.confirm(
      "¿Seguro que deseas eliminar esta maquinaria?"
    );
    if (!confirm) return;

    const requestData = new FormData();
    requestData.append("_method", "DELETE");

    try {
      const response = await fetch(
        `${API_BASE_URL}/maquinaria/${id_maquinaria}/eliminar`,
        {
          method: "POST", 
          body: requestData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        fetchMaquinaria();
        if (maquinariaSeleccionada?.id_maquinaria === id_maquinaria) {
          setMaquinariaSeleccionada(null);
        }
      } else {
        setError(result.message || "Error al eliminar.");
      }
    } catch (err) {
      console.error("Error deleting maquinaria:", err);
      setError("Error al eliminar.");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      id_maquinaria: null,
      año: "",
      marca: "",
      modelo: "",
      numero_serie: "",
    });
    setFormVisible(false);
    setError(null); // Limpiar errores al resetear el formulario
  };

  return (
    <div className="maquinaria-container">
      <div className="maquinaria-listado">
        <h2>Gestión de Maquinaria</h2>
        {error && <p className="error-text">{error}</p>}

        <button className="btn" onClick={() => {
            setFormVisible(!formVisible);
            if (formVisible) resetForm(); // Resetea el formulario al cancelar
        }}>
          {formVisible ? "Cancelar" : "Añadir Maquinaria"}
        </button>

        {formVisible && (
          <form className="maquinaria-form" onSubmit={handleFormSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Año:
              <input
                type="number"
                name="año"
                value={formData.año}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Marca:
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Modelo:
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Número de Serie:
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleInputChange}
                required
              />
            </label>

            <button className="btn" type="submit">
              {formData.id_maquinaria ? "Actualizar" : "Guardar"}
            </button>
          </form>
        )}

        <ul className="maquinaria-list">
          {maquinaria.length > 0 ? (
            maquinaria.map((item) => (
              <li
                key={item.id_maquinaria}
                onClick={() => setMaquinariaSeleccionada(item)}
                className={`maquinaria-item ${maquinariaSeleccionada?.id_maquinaria === item.id_maquinaria ? 'selected' : ''}`}
              >
                <span>{item.nombre}</span>
                <div className="actions">
                  <button
                    className="btn small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn small danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id_maquinaria);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              <p>No hay maquinaria registrada.</p>
            </div>
          )}
        </ul>
      </div>

      <div className="maquinaria-datos">
        {maquinariaSeleccionada ? (
          <div>
            <h3>Detalles de Maquinaria</h3>
            <div className="maquinaria-details">
              <p>
                <strong>Nombre:</strong> {maquinariaSeleccionada.nombre}
              </p>
              <p>
                <strong>Año:</strong> {maquinariaSeleccionada.año}
              </p>
              <p>
                <strong>Marca:</strong> {maquinariaSeleccionada.marca}
              </p>
              <p>
                <strong>Modelo:</strong> {maquinariaSeleccionada.modelo}
              </p>
              <p>
                <strong>Número de Serie:</strong>{" "}
                {maquinariaSeleccionada.numero_serie}
              </p>
            </div>
          </div>
        ) : (
          <p>Selecciona una maquinaria para ver sus datos</p>
        )}
      </div>
    </div>
  );
};

export default MaquinariaManager;