import React, { useState, useEffect } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Componentes/LandingPage.jsx";
import Register from "./Componentes/register.jsx";
import CompletarRegistro from "./Componentes/CompletarRegistro.jsx";
import Calendario from "./Componentes/Calendario.jsx";
import RegistroTrabajo from "./Componentes/RegistroTrabajo.jsx";
import Login from "./Componentes/Login.jsx";
import Agricultores from "./Componentes/Agricultores.jsx";
import Fincas from "./Componentes/Fincas.jsx";
import PrivateRoute from "./RutasPrivadas.jsx";
import FitoSanitarios from "./Componentes/Fito.jsx";
import MaquinariaManager from "./Componentes/Maquinaria.jsx";
import Trabajo from "./Componentes/Trabajo.jsx";
import VerTodos from "./Componentes/VerTodos.jsx";
import TerminosDeUso from "./Componentes/TerminosUso.jsx";
import PoliticaPrivacidad from "./Componentes/PoliticaPrivacidad.jsx";
import Futuro from "./Componentes/Futuro.jsx";
import PodioFitos from "./Componentes/podioFito.jsx";
import Contacto from "./Componentes/Contacto.jsx";
import Carga from "../public/carga.gif";
import logo from "../public/logo.png";
import "./Style/App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Nuevo estado para el menú desplegable

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setIsMenuOpen(false); // Cierra el menú al cerrar sesión
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    if (isAuthenticated === null) {
        return <img src={Carga} alt="Cargando..." className="loading" />;
    }

    return (
        <BrowserRouter>
            <header>
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <div className="logo">
                        <img src={logo} alt="Logo" className="logo-img" />
                        <span className="logo-text">AgroAsistencia</span>
                    </div>
                </Link>

                {/* Botón de hamburguesa */}
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? '✖' : '☰'} {/* Icono de cierre o hamburguesa */}
                </button>

                <nav>
                    {/* Aplica la clase 'open' condicionalmente */}
                    <ul className={`navigation-links ${isMenuOpen ? 'open' : ''}`}>
                        <li>
                            <Link to="/calendario" className="nav-link" onClick={closeMenu}>
                                Mantente al Día
                            </Link>
                        </li>
                        <li>
                            <Link to="/agricultores" className="nav-link" onClick={closeMenu}>
                                Agricultores
                            </Link>
                        </li>
                        <li>
                            <Link to="/fincas" className="nav-link" onClick={closeMenu}>
                                Fincas
                            </Link>
                        </li>
                        <li>
                            <Link to="/fitosanitarios" className="nav-link" onClick={closeMenu}>
                                Fitosanitarios
                            </Link>
                        </li>
                        <li>
                            <Link to="/maquinaria" className="nav-link" onClick={closeMenu}>
                                Maquinaria
                            </Link>
                        </li>
                        <li>
                            <Link to="/trabajo" className="nav-link" onClick={closeMenu}>
                                Crear Trabajo
                            </Link>
                        </li>
                        <li>
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="logout-button">
                                    Cerrar Sesión
                                </button>
                            ) : (
                                <Link to="/login" className="nav-link" onClick={closeMenu}>
                                    Iniciar Sesión
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/login"
                        element={<Login setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route
                        path="/register"
                        element={<Register setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route
                        path="/terminos"
                        element={<TerminosDeUso isAuthenticated={isAuthenticated} />}
                    />
                    <Route
                        path="/privacidad"
                        element={<PoliticaPrivacidad isAuthenticated={isAuthenticated} />}
                    />
                    <Route
                        path="/registro-trabajo"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <RegistroTrabajo />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/podio-fitosanitarios"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <PodioFitos />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/futuro"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Futuro />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/calendario"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Calendario />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/agricultores"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Agricultores />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/fincas"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Fincas />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/fitosanitarios"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <FitoSanitarios />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/maquinaria"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <MaquinariaManager />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/trabajo"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Trabajo />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/ver-todos"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <VerTodos />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/contacto"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Contacto />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/completar-registro" element={<CompletarRegistro />} />
                </Routes>
            </main>
            <footer className="site-footer">
                <p>&copy; 2025 Agro Asistencia. Todos los derechos reservados.</p>
                <nav>
                    <ul>
                        <li>
                            <Link to="/privacidad">Política de Privacidad</Link>
                        </li>
                        <li>
                            <Link to="/terminos">Términos de Uso</Link>
                        </li>
                        <li>
                            <Link to="/contacto">Contacto</Link>
                        </li>
                    </ul>
                </nav>
            </footer>
        </BrowserRouter>
    );
}

export default App;