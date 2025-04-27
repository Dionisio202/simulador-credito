
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import InformesEconomicos from './pages/InformesEconomicos';
import PerspectivasMercado from './pages/PerspectivasMercado';

function App() {

  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/vision-mercado/informes" element={<InformesEconomicos />} /> {/* 👈 Nueva ruta */}
      <Route path="/vision-mercado/perspectivas" element={<PerspectivasMercado />} /> {/* Aquí la nueva ruta */}

    </Routes>
  </Router>
  )
}

export default App
