import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import InformesEconomicos from "./pages/InformesEconomicos";
import PerspectivasMercado from "./pages/PerspectivasMercado";
import ConfigCreditos from "./pages/ConfigCreditos";
import ConfigInversiones from "./pages/ConfigInversiones";
import ConfigInterfaz from "./pages/ConfigInterfaz";

import { ToastContainer } from "react-toastify"; // 👈 Importas el ToastContainer
import "react-toastify/dist/ReactToastify.css"; // 👈 Importas los estilos CSS

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/vision-mercado/informes"
          element={<InformesEconomicos />}
        />
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
