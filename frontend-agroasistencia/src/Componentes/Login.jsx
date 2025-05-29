import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrores({});

    try {
      const response = await fetch('https://agroasistencia.es/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          contraseña: contraseña,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        // Guardar directamente el token que viene en la respuesta del login
        localStorage.setItem('authToken', data.token);

        setIsAuthenticated(true);
        navigate('/');
      } else {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          setErrores(errorData.errors);
        } else {
          setErrores({ general: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' });
        }
      }
    } catch (error) {
      setErrores({ general: 'Error de conexión con el servidor.' });
    }
  };

  return (
    <div className="fondo-login">
      <div className="formulario-login">
        <h2>Iniciar Sesión</h2>
        {errores.general && <p className="error">{errores.general}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
            />

            {errores.email && <p className="error">{errores.email[0]}</p>}
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
            {errores.contraseña && <p className="error">{errores.contraseña[0]}</p>}
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/register" style={{ color: 'blue' }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
