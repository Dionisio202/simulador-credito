import { useState, useEffect, FormEvent } from 'react';
import { validateLoginForm } from '../utils/validateLoginForm';
import { loginUser } from '../services/authService';
import { toast } from 'react-toastify';
import { API_URL } from '../constants/api';

interface ConfigGlobal {
  nombreEmpresa: string;
  logoUrl: string;
  textoPrincipal?: string;
  textoSecundario?: string;
  textoTerciario?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [config, setConfig] = useState<ConfigGlobal | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/configuracion-global`);
        const data = await response.json();
        setConfig(data[0]);
      } catch (error) {
        console.error("Error al obtener configuración global:", error);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateLoginForm({ email, password });
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      toast.success('¡Bienvenido a Quantum Capital!');
    } catch (error) {
      console.error('Error de login:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error desconocido al iniciar sesión.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 md:w-2/5 flex flex-col justify-center items-center">
          <div className="py-8">
            <img
              src={config ? `${API_URL}${config.logoUrl}` : ''}
              alt={config?.nombreEmpresa || 'Logo'}
              className="w-34 h-34 mx-auto mb-1"
            />
            <h1 className="text-3xl font-bold mb-3 text-center">{config?.nombreEmpresa || 'Quantum Capital'}</h1>
            <p className="text-blue-200 italic text-center mb-6">{config?.textoPrincipal}</p>
            <div className="border-t border-blue-700 pt-6 mt-6">
              <p className="text-sm text-blue-200 mb-4">{config?.textoSecundario}</p>
              <p className="text-xs text-blue-300">{config?.textoTerciario}</p>
            </div>
          </div>
        </div>

        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bienvenido</h2>
            <p className="text-gray-600">Inicia sesión para acceder a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full p-4 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="correo@quantumcapital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* ícono de ojo */}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-4 px-6 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 font-medium transition-colors duration-300"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
