import React, { useEffect, useState } from 'react';
import '../Style/podioFitos.css';
import Carga from '../../public/carga.gif';

const PodioFitos = () => {
  const [topFitos, setTopFitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://agroasistencia.es/api/fitosanitariosTop')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar datos');
        return res.json();
      })
      .then(data => {
        if (data.message) {
          setTopFitos([]);
          setError(data.message);
        } else {
          setTopFitos(data);
          setError(null);
        }
      })
      .catch(err => {
        setTopFitos([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="contenedor-carga">
          <img src={Carga} alt="Cargando..." />
        </div>;

  const getClassName = (index) => {
    if (index === 0) return 'podio-first';
    if (index === 1) return 'podio-second';
    if (index === 2) return 'podio-third';
    return '';
  };

  return (
    <div className="fitos-page">
      <div className="principal">
        <h1>🌿 Estadísticas de Fitosanitarios</h1>
        <p>Revisa cuáles son los productos más utilizados por los agricultores registrados en la plataforma.</p>
      </div>

      <section className="summary-cards">
        <div className="card">
          <h3>🔝 Total mostrados</h3>
          <p>{topFitos.length}</p>
        </div>
        <div className="card">
          <h3>🧪 Más usado</h3>
          <p>{topFitos[0]?.nombre || 'N/A'}</p>
        </div>
        <div className="card">
          <h3>📊 Usos totales</h3>
          <p>{topFitos.reduce((acc, item) => acc + item.total, 0)}</p>
        </div>
      </section>

      <section className="podio-wrapper">
        <h2 className="podio-title">🏆 Top 3 Fitosanitarios</h2>
        {topFitos.length === 0 ? (
          <div className="error">No hay fitosanitarios registrados aún.</div>
        ) : (
          <div className="podio-container">
            {topFitos.map((fito, i) => (
              <div key={fito.nombre} className={`podio-stand ${getClassName(i)}`}>
                <div className="medalla">
                  <span>{i + 1}</span>
                </div>
                <div className="podio-bar" style={{ height: `${160 - i * 40}px` }}>
                  <div className="podio-count">{fito.total}</div>
                </div>
                <div className="podio-name">{fito.nombre}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bar-graph">
        <h3>📈 Visualización horizontal de uso</h3>
        {topFitos.length === 0 ? (
          <div className="empty">No hay datos para mostrar en el gráfico.</div>
        ) : (
          topFitos.map(fito => (
            <div key={fito.nombre} className="bar-row">
              <span className="bar-label">{fito.nombre}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.min(fito.total * 10, 100)}%` }}>
                  {fito.total}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default PodioFitos;
