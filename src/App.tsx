import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PerspectivasMercado from './pages/PerspectivasMercado';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL } from './constants/api';
import { setQuantumColorsFromAPI } from './styles/colors';
import ConfigCreditos from "./pages/ConfigCreditos";
import ConfigInversiones from "./pages/ConfigInversiones";
import ConfigInterfaz from "./pages/ConfigInterfaz";
import "react-toastify/dist/ReactToastify.css"; // 👈 Importas los estilos CSS

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
        <Route
          path="/vision-mercado/perspectivas"
          element={<PerspectivasMercado />}
        />
        <Route path="/config-creditos" element={<ConfigCreditos />} />
        <Route path="/config-inversiones" element={<ConfigInversiones />} />
        <Route path="/config-interfaz" element={<ConfigInterfaz />} />
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
    </Router>
  );
}

export default App;
