import React, { useEffect, useState } from 'react';
import Carga from '../../public/carga.gif';
import '../Style/vertodos.css';

const VerTodos = () => {
  const [registros, setRegistros] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No se encontró el token de autenticación.');
      setLoading(false);
      return;
    }

    fetch(`https://agroasistencia.es/api/registro_trabajo/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los registros de trabajo.');
        return res.json();
      })
      .then(data => {
        setRegistros(data);
        setFilteredRegistros(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Hubo un problema al cargar los datos.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = registros;

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        (r.fecha?.toLowerCase().includes(lowerSearch)) ||
        (r.trabajo?.nombre?.toLowerCase().includes(lowerSearch)) ||
        (r.agricultor?.nombre?.toLowerCase().includes(lowerSearch)) ||
        (r.observaciones?.toLowerCase().includes(lowerSearch)) ||
        (r.horas_trabajadas?.toString().includes(lowerSearch))
      );
    }

    if (selectedDate !== '') {
      filtered = filtered.filter(r => r.fecha === selectedDate);
    }

    setFilteredRegistros(filtered);
  }, [searchTerm, selectedDate, registros]);

  if (loading) return <div className='contenedor-carga'><img src={Carga} alt="Cargando..." className="loading" /></div>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="registro-container">
      <h2>Registros de Trabajo</h2>

      <div className="filtros-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por fecha, trabajo, agricultor, observaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '60%', marginRight: '1rem' }}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '0.5rem' }}
        />

        {(searchTerm !== '' || selectedDate !== '') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredRegistros.length === 0 ? (
        <p className="no-registros" style={{ textAlign: 'center', marginTop: '2rem' }}>
          No se encontraron registros.
        </p>
      ) : (
        <table className="registro-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Trabajo</th>
              <th>Horas</th>
              <th>Observaciones</th>
              <th>Agricultor</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistros.map((registro, index) => (
              <tr key={index}>
                <td>{registro.fecha}</td>
                <td>{registro.trabajo?.nombre || 'Sin nombre'}</td>
                <td>{registro.horas_trabajadas}</td>
                <td>{registro.observaciones || '—'}</td>
                <td>{registro.agricultor?.nombre || 'Desconocido'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerTodos;
