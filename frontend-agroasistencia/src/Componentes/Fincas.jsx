import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Carga from "../../public/carga.gif";
import "../Style/finca.css";

// Icono personalizado para el marcador en el mapa
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente para seleccionar la ubicación en el mapa
function LocationSelector({ position, setPosition }) {
  // Hook para manejar eventos del mapa
  useMapEvents({
    click(e) {
      // Al hacer clic, actualiza la posición
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      setPosition([parseFloat(lat), parseFloat(lng)]);
    },
  });
  // Muestra un marcador si hay una posición
  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
}

// Componente principal para gestionar fincas
export default function FincasManager() {
  // Estados para la lista de fincas, finca seleccionada, posición del mapa, etc.
  const [fincas, setFincas] = useState([]);
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState([40.4168, -3.7038]); // fallback Madrid
  const [id_usuario, setid_usuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    hectareas: "",
    ubicacion: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mapFullScreen, setMapFullScreen] = useState(false);

  // Efecto para obtener la ubicación del usuario al cargar el componente
  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(userLocation);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setPosition(coords);
        setLoading(false);
      },
      () => {
        setPosition(userLocation);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  // Obtiene el token de autenticación del localStorage
  const token = localStorage.getItem("authToken");

  // Efecto para obtener el ID del usuario desde el token
  useEffect(() => {
    if (!token) {
      setError("No hay token de autenticación disponible.");
      setLoading(false);
      return;
    }
    const obtenerUserIdDesdeToken = async () => {
      try {
        const res = await fetch(
          `https://agroasistencia.es/api/usuarios/token/${token}`
        );
        if (!res.ok) {
          throw new Error(
            `Error al obtener usuario desde token. Status: ${res.status}`
          );
        }
        const data = await res.json();
        setid_usuario(data.id_usuario);
      } catch (error) {
        setError("No se pudo obtener el ID del usuario desde el token.");
        setLoading(false);
      }
    };
    obtenerUserIdDesdeToken();
  }, [token]);

  // Efecto para cargar las fincas una vez que se tiene el ID del usuario
  useEffect(() => {
    if (id_usuario) {
      fetchFincas();
    }
  }, [id_usuario]);

  // Función para obtener las fincas del usuario
  const fetchFincas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://agroasistencia.es/api/fincas/usuario/${token}`);
      if (!res.ok) {
        if (res.status === 404) {
          setFincas([]);
          setSelectedFinca(null);
          setForm({ nombre: "", hectareas: "", ubicacion: "" });
          setPosition(userLocation);
          setLoading(false);
          return;
        }
        throw new Error("Error al cargar fincas");
      }
      const data = await res.json();

      // Procesa la ubicación de cada finca
      data.forEach((finca) => {
        if (finca.ubicacion) {
          const coords = finca.ubicacion.split(",");
          if (coords.length === 2) {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            finca.lat = !isNaN(lat) ? lat : userLocation[0];
            finca.lng = !isNaN(lng) ? lng : userLocation[1];
          } else {
            finca.lat = userLocation[0];
            finca.lng = userLocation[1];
          }
        } else {
          finca.lat = userLocation[0];
          finca.lng = userLocation[1];
        }
      });

      setFincas(data);
      setSelectedFinca(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para actualizar el formulario y la posición del mapa cuando se selecciona una finca
  useEffect(() => {
    if (selectedFinca) {
      setPosition([selectedFinca.lat, selectedFinca.lng]);
      setForm({
        nombre: selectedFinca.nombre || "",
        hectareas: selectedFinca.hectareas || "",
        ubicacion: selectedFinca.ubicacion || "",
      });
    } else if (fincas.length === 0) {
        setPosition(userLocation);
        setForm({ nombre: "", hectareas: "", ubicacion: userLocation.map((c) => c.toFixed(6)).join(",") });
    }
  }, [selectedFinca, fincas, userLocation]);

  // Manejador para los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Si el campo es la ubicación, actualiza la posición del mapa
    if (name === "ubicacion") {
      const parts = value.split(",");
      if (
        parts.length === 2 &&
        !isNaN(parseFloat(parts[0])) &&
        !isNaN(parseFloat(parts[1]))
      ) {
        setPosition([parseFloat(parts[0]), parseFloat(parts[1])]);
      }
    }
  };

  // Manejador para los clics en el mapa
  const handleMapClick = (pos) => {
    setPosition(pos);
    setForm((prev) => ({
      ...prev,
      ubicacion: pos.map((c) => c.toFixed(6)).join(","),
    }));
  };

  // Componente wrapper para el selector de ubicación en el mapa
  function LocationSelectorWrapper() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        handleMapClick([parseFloat(lat), parseFloat(lng)]);
      },
    });
    return position === null ? null : (
      <Marker position={position} icon={markerIcon} />
    );
  }

  // Manejador para el envío del formulario (crear/editar finca)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmación para edición
    if (selectedFinca) {
      const confirmEdit = window.confirm(
        "¿Estás seguro que quieres editar la finca ya existente? Si no quieres, pulsa el botón limpiar formulario."
      );
      if (!confirmEdit) {
        return;
      }
    }

    // Validaciones básicas
    if (!id_usuario) {
      setError(
        "No se ha obtenido el ID del usuario. Intenta recargar la página."
      );
      return;
    }

    if (!form.nombre.trim()) {
      setError("El nombre de la finca es obligatorio.");
      return;
    }

    if (isNaN(parseFloat(form.hectareas)) || parseFloat(form.hectareas) < 0) {
      setError("Las hectáreas deben ser un número positivo.");
      return;
    }

    setSaving(true);
    setError(null);

    // Datos a enviar a la API
    const dataToSend = {
      nombre: form.nombre.trim(),
      hectareas: parseFloat(form.hectareas),
      ubicacion: form.ubicacion,
      id_usuario: id_usuario,
    };

    try {
      // Determina la URL y el método HTTP (POST para nuevo, PUT para editar)
      const url = selectedFinca
        ? `https://agroasistencia.es/api/fincas/${selectedFinca.id_finca}`
        : "https://agroasistencia.es/api/fincas";
      const method = selectedFinca ? "PUT" : "POST";

      // Realiza la petición a la API
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error guardando finca");
      }

      const fincaSaved = await res.json();

      // Procesa la ubicación de la finca guardada
      if (fincaSaved.ubicacion) {
        const coords = fincaSaved.ubicacion.split(",");
        if (coords.length === 2) {
          fincaSaved.lat = parseFloat(coords[0]) || userLocation[0];
          fincaSaved.lng = parseFloat(coords[1]) || userLocation[1];
        } else {
          fincaSaved.lat = userLocation[0];
          fincaSaved.lng = userLocation[1];
        }
      } else {
        fincaSaved.lat = userLocation[0];
        fincaSaved.lng = userLocation[1];
      }

      // Actualiza la lista de fincas
      setFincas((prev) => {
        if (selectedFinca) {
          return prev.map((f) =>
            f.id_finca === fincaSaved.id_finca ? fincaSaved : f
          );
        } else {
          return [...prev, fincaSaved];
        }
      });

      // Limpia el formulario y la selección
      setSelectedFinca(null);
      setForm({
        nombre: "",
        hectareas: "",
        ubicacion: userLocation.map((c) => c.toFixed(6)).join(","),
      });
      setPosition(userLocation);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Muestra un indicador de carga si está cargando
  if (loading)
    return (
      <div className="contenedor-carga">
        <img src={Carga} alt="Cargando..." className="gif-carga" />
      </div>
    );
  // Muestra un mensaje de error si hay un error
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="fincas-manager-container">
      {/* Sección de la lista de fincas */}
      <div className="fincas-list-container">
        <h2>Lista de Fincas</h2>
        <table className="fincas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Hectáreas</th>
              <th>Ubicación (lat,lng)</th>
            </tr>
          </thead>
          <tbody>
            {fincas.map((finca) => (
              <tr
                key={finca.id_finca}
                onClick={() => {
                  setSelectedFinca(finca);
                }}
                className={
                  selectedFinca?.id_finca === finca.id_finca
                    ? "selected-row"
                    : ""
                }
              >
                <td>{finca.nombre}</td>
                <td>{finca.hectareas}</td>
                <td>{finca.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección del formulario y el mapa */}
      <div className="form-map-container">
        <h2>{selectedFinca ? "Editar finca" : "Nueva finca"}</h2>
        {/* Botón para limpiar el formulario */}
        <button
          type="button"
          onClick={() => {
            setSelectedFinca(null);
            setForm({
              nombre: "",
              hectareas: "",
              ubicacion: position
                ? position.map((c) => c.toFixed(6)).join(",")
                : userLocation.map((c) => c.toFixed(6)).join(","),
            });
          }}
          className="btn-save"
          style={{ marginBottom: "1rem", backgroundColor: "#6c757d" }}
        >
          Limpiar Formulario
        </button>
        {/* Formulario de finca */}
        <form onSubmit={handleSubmit} className="finca-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="Nombre de la finca"
            />
          </div>
          <div className="form-group">
            <label>Hectáreas:</label>
            <input
              name="hectareas"
              type="number"
              value={form.hectareas}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              placeholder="0.0"
            />
          </div>
          <div className="form-group">
            <label>Ubicación (lat,lng):</label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Elige la ubicación en el mapa"
              title="Puedes editar la ubicación manualmente o con el mapa"
            />
          </div>
          {/* Botón de guardar */}
          <button type="submit" disabled={saving} className="btn-save">
            {saving ? "Guardando..." : "Guardar finca"}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

        {/* Contenedor del mapa */}
        <div
          className="mapa-container"
          style={{ height: mapFullScreen ? "100vh" : "400px" }}
        >
          <MapContainer
            center={position || userLocation}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className={mapFullScreen ? "map-fullscreen" : ""}
            key={mapFullScreen ? "fullscreen-map" : "normal-map"}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelectorWrapper />
          </MapContainer>

          {/* Botón para cerrar pantalla completa del mapa */}
          {mapFullScreen && (
            <button
              className="btn-fullscreen-close"
              onClick={() => setMapFullScreen(false)}
            >
              Cerrar pantalla completa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
