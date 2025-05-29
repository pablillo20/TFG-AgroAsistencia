import React, { useState, useEffect } from "react";
import Carga from "../../public/carga.gif"; 
import "../Style/agricultores.css"; 

/**
 * Componente principal de la aplicación para la gestión de agricultores.
 * Permite listar, buscar y registrar nuevos agricultores.
 */
function App() {

  // Estado para almacenar la lista de agricultores obtenida del API.
  const [agricultores, setAgricultores] = useState([]);

  // Estado para manejar los datos del formulario de registro de un nuevo agricultor.
  const [formData, setFormData] = useState({
    DNI: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    localidad: "",
  });

  // Estados para los campos de búsqueda por DNI y Localidad.
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [localidadBusqueda, setLocalidadBusqueda] = useState("");

  // Estado para almacenar los mensajes de error recibidos del servidor o errores generales.
  const [errores, setErrores] = useState({});
  // Estado para mostrar mensajes de éxito después de una operación (ej. registro).
  const [mensajeExito, setMensajeExito] = useState("");
  // Estado booleano para indicar si una operación de red está en curso (mostrar/ocultar GIF de carga).
  const [cargando, setCargando] = useState(false);


  /**
   * useEffect se ejecuta una vez al montar el componente.
   * Su propósito es cargar la lista inicial de agricultores desde el API.
   */
  useEffect(() => {
    fetchAgricultores();
  }, []); 

  /**
   * Función para obtener la lista de agricultores desde el API.
   * Actualiza el estado 'agricultores' con los datos recibidos.
   * Maneja el estado de carga y posibles errores.
   */
  const fetchAgricultores = async () => {
    setCargando(true); 
    try {
      const response = await fetch("https://agroasistencia.es/api/agricultores");
      // Verifica si la respuesta de la red fue exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json(); 
      setAgricultores(data); 
    } catch (error) {
      console.error("Error al cargar agricultores:", error); 
      setErrores({ general: "Error al cargar los agricultores. Intente de nuevo más tarde." }); 
    } finally {
      setCargando(false); 
    }
  };

  /**
   * Manejador de eventos para actualizar los campos del formulario.
   * Se llama cada vez que un input del formulario cambia.
   */
  const handleChange = (e) => {
    // Actualiza el estado 'formData' manteniendo los valores anteriores
    // y sobrescribiendo solo el campo que ha cambiado ([e.target.name]: e.target.value).
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Manejador de eventos para el envío del formulario de registro de agricultor.
   * Envía los datos del nuevo agricultor al API mediante una solicitud POST.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)

    // Limpia mensajes de estado anteriores antes de una nueva operación
    setErrores({});
    setMensajeExito("");
    setCargando(true);

    try {
      const response = await fetch("https://agroasistencia.es/api/agricultores", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, // Indica que el cuerpo de la solicitud es JSON
        body: JSON.stringify(formData), // Convierte el objeto 'formData' a una cadena JSON
      });

      const data = await response.json(); // Parsea la respuesta JSON del servidor

      if (response.ok) {
        // Si la respuesta HTTP es 2xx (éxito)
        setMensajeExito("Agricultor registrado con éxito."); // Muestra mensaje de éxito
        // Restablece el formulario a sus valores iniciales vacíos
        setFormData({
          DNI: "",
          nombre: "",
          apellidos: "",
          telefono: "",
          localidad: "",
        });
        fetchAgricultores(); 
      } else {
        if (data?.errors) {
          // Si el servidor devuelve errores de validación específicos
          setErrores(data.errors); 
        } else {
          // Si es un error general sin detalles de validación
          setErrores({ general: data.message || "Error al registrar el agricultor." });
        }
      }
    } catch (error) {
      console.error("Error de conexión o inesperado:", error); 
      setErrores({ general: "Error de conexión con el servidor. Por favor, intente de nuevo." });
    } finally {
      setCargando(false); 
    }
  };

  /**
   * Normaliza una cadena de texto para facilitar la búsqueda insensible a mayúsculas/minúsculas y tildes.
   * Elimina tildes, puntos y comas, y convierte el texto a minúsculas.
   */
  const normalizarTexto = (texto) =>
    texto
      .normalize("NFD") // Descompone caracteres unicode (ej. 'á' a 'a' + tilde)
      .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (la tilde separada)
      .replace(/[.,]/g, "") // Elimina puntos y comas
      .toLowerCase(); // Convierte todo a minúsculas para una búsqueda insensible a mayúsculas/minúsculas

  /**
   * Filtra la lista de agricultores basándose en los valores de búsqueda de DNI y Localidad.
   */
  const agricultoresFiltrados = agricultores.filter((a) => {
    const dniMatch = normalizarTexto(a.DNI).includes(normalizarTexto(dniBusqueda));
    const localidadMatch = normalizarTexto(a.localidad || "").includes(normalizarTexto(localidadBusqueda));
    return dniMatch && localidadMatch;
  });


  if (cargando) {
    return (
      <div className="contenedor-carga">
        <img src={Carga} alt="Cargando..." />
      </div>
    );
  }

  return (
    <div className="contenedor-agricultores">
      <h2>Agricultores</h2>

      {/* Sección de Buscadores */}
      <div className="buscador">
        <label htmlFor="buscarLocalidad">Localidad:</label>
        <input
          type="text"
          id="buscarLocalidad"
          value={localidadBusqueda}
          onChange={(e) => setLocalidadBusqueda(e.target.value)} // Actualiza el estado de búsqueda de localidad
          placeholder="Ingrese Localidad..."
        />
      </div>

      <div className="buscador">
        <label htmlFor="buscarDNI">DNI:</label>
        <input
          type="text"
          id="buscarDNI"
          value={dniBusqueda}
          onChange={(e) => setDniBusqueda(e.target.value)} // Actualiza el estado de búsqueda de DNI
          placeholder="Ingrese DNI..."
        />
      </div>

      {/* Mensajes informativos para el usuario sobre el estado de la tabla */}
      {agricultores.length === 0 && !cargando && (
        <p className="error">No hay agricultores registrados.</p>
      )}
      {agricultores.length > 0 && agricultoresFiltrados.length === 0 && (
        <p className="error">No se encontraron agricultores con esos datos.</p>
      )}

      {/* Tabla para mostrar la lista de agricultores */}
      <div className="tabla-agricultores">
        <table>
          <thead>
            <tr>
              {/* La columna DNI ha sido eliminada de la visualización de la tabla */}
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Teléfono</th>
              <th>Localidad</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea sobre los agricultores filtrados para renderizar cada fila */}
            {agricultoresFiltrados.map((agricultor, i) => (
              <tr key={i}>
                {/* La celda DNI ha sido eliminada de la visualización de la tabla */}
                <td>{agricultor.nombre}</td>
                <td>{agricultor.apellidos || "-"}</td> {/* Muestra "-" si los apellidos son nulos/vacíos */}
                <td>
                  {/* Condición para renderizar el enlace de WhatsApp solo si hay un número de teléfono */}
                  {agricultor.telefono ? (
                    <a
                      // Crea el enlace de WhatsApp limpiando el número de caracteres no numéricos
                      href={`https://wa.me/${agricultor.telefono.replace(/\s|-|\(|\)/g, '')}`}
                      target="_blank" // Abre el enlace en una nueva pestaña
                      rel="noopener noreferrer" // Mejora la seguridad al abrir enlaces externos
                    >
                      {agricultor.telefono}
                    </a>
                  ) : (
                    "-" // Muestra "-" si no hay número de teléfono
                  )}
                </td>
                <td>{agricultor.localidad || "-"}</td> {/* Muestra "-" si la localidad es nula/vacía */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario para registrar un nuevo agricultor */}
      <h3>Registrar nuevo agricultor</h3>
      {/* Mensajes de éxito y error del formulario */}
      {mensajeExito && <p className="exito">{mensajeExito}</p>}
      {errores.general && <p className="error">{errores.general}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>DNI: *</label> {/* El campo DNI es visible en el formulario */}
          <input
            type="text"
            name="DNI"
            value={formData.DNI}
            onChange={handleChange}
          />
          {/* Muestra el error específico del campo DNI si existe */}
          {errores.DNI && <p className="error">{errores.DNI[0]}</p>}
        </div>

        <div>
          <label>Nombre: *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errores.nombre && <p className="error">{errores.nombre[0]}</p>}
        </div>

        <div>
          <label>Apellidos: *</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
          />
          {errores.apellidos && <p className="error">{errores.apellidos[0]}</p>}
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          {errores.telefono && <p className="error">{errores.telefono[0]}</p>}
        </div>

        <div>
          <label>Localidad:</label>
          <input
            type="text"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
          />
          {errores.localidad && <p className="error">{errores.localidad[0]}</p>}
        </div>

        <button type="submit" disabled={cargando}>
          {/* Cambia el texto del botón según el estado de carga */}
          {cargando ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default App; 
