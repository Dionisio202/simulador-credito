import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PerspectivasMercado from './pages/PerspectivasMercado';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimuladorInversion from './pages/SimuladorInversion';

import { API_URL } from './constants/api';
import { setQuantumColorsFromAPI } from './styles/colors';
import ConfigCreditos from "./pages/ConfigCreditos";
import ConfigInversiones from "./pages/ConfigInversiones";
import ConfigInterfaz from "./pages/ConfigInterfaz";
import "react-toastify/dist/ReactToastify.css"; // 👈 Importas los estilos CSS
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const res = await fetch(`${API_URL}/configuration/configuracion-global`);
        const data = await res.json();
        if (data.length > 0) {
          setQuantumColorsFromAPI(data[0]); // 👈 Actualiza los colores globales
        }
      } catch (error) {
        console.error('Error al cargar configuración global:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracion();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Cargando configuración...
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/vision-mercado/perspectivas" element={<PerspectivasMercado />} />

  {/* Rutas protegidas solo para Admin */}
  <Route path="/config-interfaz" element={
    <ProtectedRoute element={<ConfigInterfaz />} allowedRoles={['Admin']} />
  } />

  {/* Rutas protegidas para Admin y Financiero */}
  <Route path="/config-creditos" element={
    <ProtectedRoute element={<ConfigCreditos />} allowedRoles={['Admin', 'Asesor']} />
  } />
  <Route path="/config-inversiones" element={
    <ProtectedRoute element={<ConfigInversiones />} allowedRoles={['Admin', 'Asesor']} />
  } />

  <Route path="/simulador-inversion" element={<SimuladorInversion />} />
</Routes>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Clases necesarias para mantener configuraciones dinámicas desde el backend */}
  <div className="hidden">
    bg-white bg-black bg-blue-900 bg-blue-800 bg-blue-700 bg-blue-600
    bg-gray-50 bg-gray-100 bg-gray-200 bg-gray-800 bg-gray-900
    text-white text-black text-blue-100 text-blue-200 text-blue-300
    text-gray-800 text-gray-700 text-gray-600
  </div>
    </Router>
  );
}

export default App;
