import React from 'react';
import '../Style/WeatherDisplay.css';

const WeatherDisplay = ({ weather, loading, error }) => {
    if (loading) {
        return <div className="weather-display">Cargando clima...</div>;
    }

    if (error) {
        return <div className="weather-display error">Error: {error}</div>;
    }

    if (weather) {
        return (
            <div className="weather-display">
                <div className="weather-display__title-container">
                    <span className="sun-icon">☀️</span>
                    <h2>El Tiempo</h2>
                </div>
                <h3>{weather.name}, {weather.sys.country}</h3> 
                <p><strong>Clima:</strong> {weather.weather[0].description}</p>
                <p><strong>Temperatura:</strong> {weather.main.temp } °C</p> 
                <p><strong>Humedad:</strong> {weather.main.humidity} %</p>
                {weather.wind && (
                    <>
                        <p><strong>Viento:</strong> {weather.wind.speed} m/s</p>
                        {weather.wind.deg && (
                            <p><strong>Dirección del viento:</strong> {weather.wind.deg} grados</p>
                        )}
                        {weather.wind.gust && (
                            <p><strong>Ráfagas:</strong> {weather.wind.gust} m/s</p>
                        )}
                    </>
                )}
            </div>
        );
    }

    return null;
};

export default WeatherDisplay;