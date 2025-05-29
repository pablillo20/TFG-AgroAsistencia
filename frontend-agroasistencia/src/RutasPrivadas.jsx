import React from 'react';
import { Navigate } from 'react-router-dom';
import Carga from "../public/carga.gif"; 

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated === null) {
    return <img src={Carga} alt="Cargando..." className="loading" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;
