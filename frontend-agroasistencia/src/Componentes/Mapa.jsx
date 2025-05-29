import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import WeatherDisplay from './WeatherDisplay.jsx';
import markerIcon from '../../public/marker-icon.png';
import markerShadow from '../../public/marker-shadow.png';
import Carga from '../../public/carga.gif';

const API_KEY = 'c0acb102acf672ef8d127372eb638bb4';

const MapaConGeolocalizacion = () => {
    const [position, setPosition] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const [weatherError, setWeatherError] = useState(null);
    const [initialLocationLoaded, setInitialLocationLoaded] = useState(false);

    // Define el ícono personalizado para el marcador
    const customIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });

    // Efecto para obtener la ubicación inicial del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    setInitialLocationLoaded(true);
                },
                (error) => {
                    console.error("Error al obtener la ubicación inicial:", error);
                    // Fallback a una ubicación por defecto (ej. centro de España)
                    setPosition([40.416775, -3.703790]); // Madrid
                    setInitialLocationLoaded(true);
                }
            );
        } else {
            console.error("La geolocalización no está soportada en este navegador.");
            // Fallback a una ubicación por defecto
            setPosition([40.416775, -3.703790]); // Madrid
            setInitialLocationLoaded(true);
        }
    }, []); // Se ejecuta solo una vez al montar

    // Obtener los datos del clima cuando la posición cambia
    useEffect(() => {
        if (position) {
            setLoadingWeather(true);
            setWeatherError(null);
            const [lat, lon] = position;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`https error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setWeather(data);
                    setLoadingWeather(false);
                })
                .catch(error => {
                    console.error("Error al obtener el clima:", error);
                    setWeatherError(error.message);
                    setLoadingWeather(false);
                });
        }
    }, [position]); // Depende de 'position', se re-ejecuta con cada cambio de ubicación

    // Componente interno para manejar los clics en el mapa
    const MapClickEventHandler = () => {
        useMapEvents({
            click: (e) => {
                // Actualiza la posición con las coordenadas del clic
                setPosition([e.latlng.lat, e.latlng.lng]);
                console.log("Nueva ubicación seleccionada por clic:", e.latlng.lat, e.latlng.lng);
            },
        });
        return null; 
    };

    if (!initialLocationLoaded) {
        return (
            <div className="contenedor-carga" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img src={Carga} alt="Cargando mapa y ubicación..." style={{ width: '100px', height: '100px' }} />
                <p>Cargando mapa y ubicación...</p>
            </div>
        );
    }

    // Una vez que la ubicación inicial está cargada, renderiza el mapa y el clima
    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <MapContainer
                center={position} // El mapa se centrará en la posición actual
                zoom={13}
                style={{ height: '400px', width: '100%' }}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {position && ( // Renderiza el marcador solo si hay una posición
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            Ubicación Actual:<br />
                            Lat: {position[0].toFixed(4)}<br />
                            Lon: {position[1].toFixed(4)}
                        </Popup>
                    </Marker>
                )}
                {/* Integra el componente interno para manejar los clics */}
                <MapClickEventHandler />
            </MapContainer>

            {loadingWeather ? (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <img src={Carga} alt="Cargando clima..." style={{ width: '50px', height: '50px' }} />
                    <p>Cargando clima...</p>
                </div>
            ) : (
                <WeatherDisplay
                    weather={weather}
                    loading={loadingWeather}
                    error={weatherError}
                />
            )}
        </div>
    );
};

export default MapaConGeolocalizacion;