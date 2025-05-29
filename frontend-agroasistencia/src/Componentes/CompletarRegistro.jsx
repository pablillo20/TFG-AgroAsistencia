import React, { useState, useEffect } from 'react';
import '../Style/register.css';
import Carga from '../../public/carga.gif';


function CompletarRegistro({ usuarioIdInicial, nombreInicial, emailInicial }) {
  // Estados 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  // Variables para los datos iniciales del usuario
  const usuarioId = usuarioIdInicial;
  const nombre = nombreInicial;
  const email = emailInicial;

  // Efect para mostrar el modal al cargar y controlar el scroll del cuerpo
  useEffect(() => {
    setMostrarModal(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Función para validar los campos del formulario
  const validarCampos = () => {
    const errores = {};
    if (!apellidos.trim()) errores.apellidos = ['El campo apellidos es obligatorio.'];
    if (!dni.trim()) errores.DNI = ['El campo DNI es obligatorio.'];
    if (!telefono.trim()) errores.telefono = ['El campo teléfono es obligatorio.'];
    if (!direccion.trim()) errores.direccion = ['El campo dirección es obligatorio.'];
    return errores;
  };

  // Manejador para el botón "Completar ahora"
  const handleCompletarAhora = () => {
    setMostrarModal(false);
    setMostrarFormulario(true);
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErroresFormulario({});
    setMensajeExito('');
    setCargando(true);

    const erroresLocales = validarCampos();
    if (Object.keys(erroresLocales).length > 0) {
      setErroresFormulario(erroresLocales);
      setCargando(false);
      return;
    }

    try {
      // Envía los datos a la API
      const response = await fetch(`https://agroasistencia.es/api/usuarios/${usuarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          apellidos,
          DNI: dni,
          telefono,
          direccion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeExito('Registro completado con éxito.');
        setMostrarFormulario(false);
        document.body.style.overflow = 'auto';
      } else {
        if (data?.errors) {
          setErroresFormulario(data.errors);
        } else {
          setErroresFormulario({ general: 'Error al actualizar el registro.' });
        }
      }
    } catch (error) {
      setErroresFormulario({ general: 'Error de conexión con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Overlay y contenedores de modal/formulario */}
      {(mostrarModal || mostrarFormulario) && (
        <div className="overlay-bloqueo">
          {/* Modal de bienvenida */}
          {mostrarModal && (
            <div className="modal-registro">
              <h3>COMPLETA EL REGISTRO DE USUARIO</h3>
              <button onClick={handleCompletarAhora}>Completar ahora</button>
            </div>
          )}

          {/* Formulario de completar registro */}
          {mostrarFormulario && (
            <div className="formulario-completa-registro">
              <h2>Completa tu registro</h2>
              {mensajeExito && <p className="exito">{mensajeExito}</p>}
              {erroresFormulario.general && <p className="error">{erroresFormulario.general}</p>}

              {/* Indicador de carga */}
              {cargando && (
                <div className="contenedor-carga">
                  <img src={Carga} alt="Cargando..." className="gif-carga" />
                </div>
              )}

              {/* Formulario de entrada de datos */}
              <form onSubmit={handleSubmit}>
                {/* Campo Apellidos */}
                <div>
                  <label htmlFor="apellidos">Apellidos: *</label>
                  <input
                    type="text"
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Tus apellidos"
                  />
                  {erroresFormulario.apellidos &&
                    erroresFormulario.apellidos.map((err, i) => (
                      <p key={i} className="error">{err}</p>
                    ))}
                </div>

                {/* Campo DNI */}
                <div>
                  <label htmlFor="dni">DNI: *</label>
                  <input
                    type="text"
                    id="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Tu DNI"
                  />
                  {erroresFormulario.DNI &&
                    erroresFormulario.DNI.map((err, i) => (
                      <p key={i} className="error">{err}</p>
                    ))}
                </div>

                {/* Campo Teléfono */}
                <div>
                  <label htmlFor="telefono">Teléfono: *</label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Tu número de teléfono"
                  />
                  {erroresFormulario.telefono &&
                    erroresFormulario.telefono.map((err, i) => (
                      <p key={i} className="error">{err}</p>
                    ))}
                </div>

                {/* Campo Dirección */}
                <div>
                  <label htmlFor="direccion">Dirección: *</label>
                  <input
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Tu dirección"
                  />
                  {erroresFormulario.direccion &&
                    erroresFormulario.direccion.map((err, i) => (
                      <p key={i} className="error">{err}</p>
                    ))}
                </div>

                {/* Botón de guardar */}
                <button type="submit" disabled={cargando}>
                  Guardar
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CompletarRegistro;
