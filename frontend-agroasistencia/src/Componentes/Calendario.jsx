import React, { useState, useEffect } from "react";
import "../Style/calendario.css";
import { useNavigate } from "react-router-dom";
import Carga from "../../public/carga.gif";

function Calendario() {
  // Estados del componente
  const [fechaActual, setFechaActual] = useState(new Date()); 
  const [diasConTrabajo, setDiasConTrabajo] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const [userId, setUserId] = useState(null); 

  const navigate = useNavigate(); // Hook para navegar a otra página
  const token = localStorage.getItem("authToken"); // Obtenemos el token de autenticación del almacenamiento local

  useEffect(() => {
    const obtenerUserIdDesdeToken = async () => {
      try {
        const res = await fetch(
          `https://agroasistencia.es/api/usuarios/token/${token}`
        );
        if (!res.ok)
          throw new Error(
            `Error al obtener usuario desde token. Status: ${res.status}`
          );
        const data = await res.json();
        setUserId(data.id_usuario); // Guardamos el ID en el estado
      } catch (error) {
        console.error("Error obteniendo el ID del usuario:", error);
        setError("No se pudo obtener el ID del usuario desde el token.");
        setLoading(false);
      }
    };

    obtenerUserIdDesdeToken();
  }, [token]);

  // Cargar los trabajos del usuario cuando se tenga su ID
  useEffect(() => {
    if (!userId) return;

    // Actualiza la fecha cada día automáticamente
    const intervalId = setInterval(() => {
      setFechaActual(new Date());
    }, 24 * 60 * 60 * 1000); // cada 24h

    const obtenerDiasConTrabajo = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://agroasistencia.es/api/registro_trabajo/dias?id_usuario=${userId}`
        );
        if (!res.ok) throw new Error(`https error! status: ${res.status}`);

        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();

          // Convertimos los datos a un formato más fácil de usar
          const fechasConTrabajoFormateadas = await Promise.all(
            data.map(async (dia) => {
              const fechaObj = new Date(dia.fecha);
              const fechaFormateada = fechaObj.toISOString().split("T")[0]; 
              const tituloTrabajo = await obtenerTituloTrabajo(
                dia.fecha,
                userId
              ); 
              return { fecha: fechaFormateada, titulo: tituloTrabajo };
            })
          );
          setDiasConTrabajo(fechasConTrabajoFormateadas); 
        } else {
          throw new Error(`Respuesta no es JSON. Content-Type: ${contentType}`);
        }
      } catch (err) {
        console.error("Error al obtener los trabajos para el calendario:", err);
        setError("Error al cargar los trabajos para el calendario.");
      } finally {
        setLoading(false);
      }
    };

    // Esta función busca el nombre del trabajo en una fecha dada
    const obtenerTituloTrabajo = async (fecha, userId) => {
      try {
        const res = await fetch(
          `https://agroasistencia.es/api/registro_trabajo/trabajos?id_usuario=${userId}&fecha=${fecha}`
        );
        if (!res.ok) throw new Error(`https error! status: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Si hay trabajos, los unimos con "/"
          return data.map((trabajo) => trabajo.trabajo.nombre).join(" / ");
        }
        return "";
      } catch (error) {
        console.error("Error al obtener el título del trabajo:", error);
        return "";
      }
    };

    obtenerDiasConTrabajo();
    return () => clearInterval(intervalId); 
  }, [userId, fechaActual]);

  // Variables para mostrar el mes actual en el calendario
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const primerDiaDelMes = new Date(año, mes, 1);
  const ultimoDiaDelMes = new Date(año, mes + 1, 0);
  const diasEnElMes = ultimoDiaDelMes.getDate();
  const diaDeLaSemanaPrimerDia = (primerDiaDelMes.getDay() + 6) % 7; // Ajuste para que el lunes sea el primer día de la semana

  // Nombres de los días y meses en español
  const nombresDeLosDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const nombresDeLosMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Cambiar el mes actual
  const cambiarMes = (direccion) => {
    setFechaActual((prevFecha) => {
      let nuevoMes = prevFecha.getMonth() + direccion;
      let nuevoAño = prevFecha.getFullYear();
      if (nuevoMes < 0) {
        nuevoMes = 11;
        nuevoAño--;
      } else if (nuevoMes > 11) {
        nuevoMes = 0;
        nuevoAño++;
      }
      return new Date(nuevoAño, nuevoMes, 1);
    });
  };

  // Cambiar manualmente mes o año
  const manejarCambioMes = (e) => {
    const nuevoMes = parseInt(e.target.value, 10);
    setFechaActual(
      (prevFecha) => new Date(prevFecha.getFullYear(), nuevoMes, 1)
    );
  };
  const manejarCambioAño = (e) => {
    const nuevoAño = parseInt(e.target.value, 10);
    setFechaActual((prevFecha) => new Date(nuevoAño, prevFecha.getMonth(), 1));
  };

  // Lista de años disponibles para seleccionar
  const añosDisponibles = [];
  for (let a = 2000; a <= new Date().getFullYear() + 5; a++) {
    añosDisponibles.push(a);
  }

  // Cuando se hace clic en un día, redirige a los detalles de ese día
  const handleDiaClick = (dia) => {
    const mesFormateado = (mes + 1).toString().padStart(2, "0");
    const diaFormateado = dia.toString().padStart(2, "0");
    const fechaParametro = `${año}-${mesFormateado}-${diaFormateado}`;
    navigate(`/registro-trabajo?fecha=${fechaParametro}`);
  };

  // Generamos las celdas del calendario
  const diasDelMes = [];

  // Espacios vacíos antes del primer día
  for (let i = 0; i < diaDeLaSemanaPrimerDia; i++) {
    diasDelMes.push(<td key={`vacio-${i}`} className="celda vacia"></td>);
  }

  // Añadir cada día del mes
  for (let dia = 1; dia <= diasEnElMes; dia++) {
    const mesFormateado = (mes + 1).toString().padStart(2, "0"); 
    const diaFormateado = dia.toString().padStart(2, "0");
    const fechaDelDia = `${año}-${mesFormateado}-${diaFormateado}`;

    const trabajoEnEsteDia = diasConTrabajo.find(
      (t) => t.fecha === fechaDelDia
    );
    const hoy = new Date();
    const esHoy =
      dia === hoy.getDate() &&
      mes === hoy.getMonth() &&
      año === hoy.getFullYear();
    const claseDiaConTrabajo = trabajoEnEsteDia ? "con-trabajo" : "";

    diasDelMes.push(
      <td
        key={dia}
        className={`celda clickable ${
          esHoy ? "hoy" : ""
        } ${claseDiaConTrabajo}`}
        onClick={() => handleDiaClick(dia)}
      >
        {dia}
        {trabajoEnEsteDia && (
          <div className="titulo-trabajo">{trabajoEnEsteDia.titulo}</div>
        )}
      </td>
    );
  }

  // Agrupamos los días en filas de 7 (una por semana)
  const filas = [];
  let diasEnFila = [];
  diasDelMes.forEach((dia, index) => {
    diasEnFila.push(dia);
    if ((index + 1) % 7 === 0) {
      filas.push(<tr key={`fila-${filas.length}`}>{diasEnFila}</tr>);
      diasEnFila = [];
    }
  });

  // Si queda alguna fila incompleta, la rellenamos con celdas vacías
  if (diasEnFila.length > 0) {
    while (diasEnFila.length < 7) {
      diasEnFila.push(
        <td
          key={`vacio-final-${diasEnFila.length}`}
          className="celda vacia"
        ></td>
      );
    }
    filas.push(<tr key={`fila-${filas.length}`}>{diasEnFila}</tr>);
  }

  // Mostrar animación de carga
  if (loading) {
    return (
      <div className="contenedor-carga">
        <img src={Carga} alt="Cargando..." />
      </div>
    );
  }

  // Mostrar error si ocurrió
  if (error) return <div className="mensaje-error">{error}</div>;

  // Render del calendario completo
  return (
    <div className="contenedor-calendario">
      <div className="calendario">
        {/* Redirigir a un componente de registros de trabajo */}
        <button
          onClick={() => navigate("/ver-todos")}
          className="boton-navegacion"
        >
          Ver Todos
        </button>
        <h2 className="titulo">CALENDARIO</h2>
        <div className="navegacion-mes">
          <button onClick={() => cambiarMes(-1)} className="boton-navegacion">
            {"<"}
          </button>
          <select
            value={mes}
            onChange={manejarCambioMes}
            className="selector-mes"
          >
            {nombresDeLosMeses.map((nombreMes, index) => (
              <option key={index} value={index}>
                {nombreMes}
              </option>
            ))}
          </select>
          <select
            value={año}
            onChange={manejarCambioAño}
            className="selector-año"
          >
            {añosDisponibles.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button onClick={() => cambiarMes(1)} className="boton-navegacion">
            {">"}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              {nombresDeLosDias.map((dia) => (
                <th key={dia}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Calendario;
