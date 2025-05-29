import React from "react";
import "../Style/Futuro.css"; 
import agricultores from "../../public/agricultores.jpg";
import pesticida from "../../public/pesticida.jpg";
import recursos from "../../public/recursos.jpg";

const Futuro = () => {
  return (
    <section className="futuro-section">
      <div className="futuro-header">
        <h1 className="futuro-title">El Futuro de la Agricultura</h1>
        <p className="futuro-subtitle">
          Plataforma inteligente que transforma la gestión agrícola con tecnología avanzada, visualizaciones claras y conexión total entre agricultores, terrenos y personal.
        </p>
      </div>

      <div className="futuro-grid">
        <div className="futuro-card">
          <div className="futuro-image">
            <img src={pesticida} alt="Pesticida" />
          </div>
          <div className="futuro-content">
            <h3>Control de Pesticidas</h3>
            <p>
              Gestiona el uso de productos fitosanitarios con precisión, reduce riesgos y cumple con normativas de forma eficiente.
            </p>
          </div>
        </div>

        <div className="futuro-card">
          <div className="futuro-image" >
            <img src={recursos} alt="Recursos" />
          </div>
          <div className="futuro-content">
            <h3>Optimización de Recursos</h3>
            <p>
              Ahorra agua, fertilizantes y energía con reportes inteligentes, sensores y recomendaciones basadas en datos reales.
            </p>
          </div>
        </div>

        <div className="futuro-card">
          <div className="futuro-image">
            <img src={agricultores} alt="Agricultores" />
          </div>
          <div className="futuro-content">
            <h3>Gestión de Personal</h3>
            <p>
              Organiza equipos de trabajo, horarios, tareas y reportes desde una sola plataforma, accesible desde cualquier dispositivo.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Futuro;
