import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/register.css';

function Register({ setIsAuthenticated }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrores({});

    // Validación local de contraseñas
    if (contraseña !== confirmarContraseña) {
      setErrores({ confirmarContraseña: ['Las contraseñas no coinciden.'] });
      return;
    }

    try {
      const response = await fetch('https://agroasistencia.es/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          contraseña,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        navigate(`/?userId=${token}&nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`);
      } else {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          setErrores(errorData.errors);
        } else {
          setErrores({ general: 'Error al registrar el usuario.' });
        }
      }
    } catch (error) {
      setErrores({ general: 'Error de conexión con el servidor.' });
    }
  };

  return (
    <div className="fondo">
      <div className="formulario">
        <h2>Regístrate Ahora</h2>
        {errores.general && <p className="errors">{errores.general}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
            {errores.nombre && <p className="errors">{errores.nombre[0]}</p>}
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
            />
            {errores.email && <p className="errors">{errores.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="********"
            />
            {errores.contraseña && <p className="errors">{errores.contraseña[0]}</p>}
          </div>

          <div>
            <label htmlFor="confirmarContraseña">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmarContraseña"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              placeholder="********"
            />
            {errores.confirmarContraseña && <p className="errors">{errores.confirmarContraseña[0]}</p>}
          </div>

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
