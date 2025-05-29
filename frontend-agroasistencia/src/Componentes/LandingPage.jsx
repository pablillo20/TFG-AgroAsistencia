import { Link, useSearchParams } from "react-router-dom"; 
import React, { useState, useEffect } from "react"; 

// COMPONENTES
import MapaConGeolocalizacion from "./Mapa";
import CompletarRegistro from "./CompletarRegistro";

// IMAGENES
import Landig from "../../public/Landing1.jpg";
import Fito from "../../public/ControlFito.jpg";
import Tractor from "../../public/tractor.jpg";
import Agricultores from "../../public/agricultores.png";
import "../Style/LandingPage.css";

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const nombre = searchParams.get("nombre");
  const email = searchParams.get("email");
  const [mostrarModalCompletaRegistro, setMostrarModalCompletaRegistro] =
    useState(false);

  useEffect(() => {
    if (userId) {
      setMostrarModalCompletaRegistro(true);
    }
  }, [userId]);

  return (
    <div className="landing-page">
      <section className="hero" id="home">
        <div className="hero-text">
          <h1>El Futuro de la Agricultura </h1>
          <p>
            Descubre cómo nuestra plataforma está revolucionando la manera en
            que se gestionan la Agricultura, desde el control de pesticidas
            hasta la optimización de recursos y la conexión con tus
            trabajadores.
          </p>
          <Link to="/futuro" className="button button-primary">
            Aprende Más
          </Link>
        </div>
        <div className="hero-image">
          <img src={Landig} alt="Agricultura Sostenible" />
        </div>
      </section>

      <section className="pesticides-section" id="pesticides">
        <div className="section-title">
          <h2>Gestión Inteligente de Pesticidas</h2>
          <p>
            Observa que pesticidas son los más utilizados por los agricultores registrados en la plataforma.
          </p>
        </div>
        <div className="pesticides-info">
          <img src={Fito} alt="Información de Pesticides" />
          <div className="pesticides-details">
            <h3>Información Detallada</h3>
            <p>
              <span className="detail-label">Actualización: </span> Diaria
            </p>
            <p>
              <span className="detail-label">A tu servicio:</span>{" "}
              <span className="positive">Todos los días</span>
            </p>
            <p>
              <span className="detail-label">Cuota mensual:</span> 0,0€
            </p>
            <Link to="/podio-fitosanitarios">
            <button className="button button-secondary"> Ver Detalles</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="farmers" id="farmers">
        <div className="section-title">
          <h2>Conéctate con Otros Agricultores y la Tecnología</h2>
          <p>
            Explora herramientas y una comunidad para impulsar tu producción.
          </p>
        </div>
        <div className="image-grid">
          <div className="image-card">
            <img src={Agricultores} alt="Agricultores" />
            <div className="overlay-content">
              <h4>Agricultores Disponibles</h4>
              <p>Buscas agricultores, consulta nuestra lista y ponte en contacto con ellos.</p>
              <Link to="/agricultores" className="learn-more-link">
                Ver Más
              </Link>
            </div>
          </div>
          <div className="image-card">
            <img src={Tractor} alt="Tractor" />
            <div className="overlay-content">
              <h4>Tu maquinaria</h4>
              <p>Registra tu tractor o maquinaria con la que trabajas, y ten un control sobre ellas</p>
              <Link to="/maquinaria" className="learn-more-link">
                Ver Más
              </Link>
            </div>
          </div>
        </div>
        <div className="map-weather-placeholder">
          <h3>Mapa Interactivo y Clima Local</h3>
          <p>Explora datos Geográficos y consulta el clima en tu zona</p>
          <MapaConGeolocalizacion />
        </div>
      </section>

      <div className="final">
        <section className="call-to-action" id="learn-more">
          <div className="cta-text">
            <h2>¿Listo para transformar tu trabajo?</h2>
            <p>
              Únete a nuestra comunidad de agricultores innovadores y lleva tu
              producción al siguiente nivel.
            </p>
            <Link to="/register" className="button button-secondary">
              Regístrate Ahora
            </Link>
          </div>
        </section>

        
      </div>

      {mostrarModalCompletaRegistro && (
        <CompletarRegistro
          usuarioIdInicial={userId}
          nombreInicial={nombre}
          emailInicial={email}
        />
      )}
    </div>
  );
};

export default LandingPage;
