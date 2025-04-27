import { useState, FormEvent } from 'react';
import { validateLoginForm } from '../utils/validateLoginForm'; // Importas tu utils
import { loginUser } from '../services/authService'; // Importas tu service
import logoQuantum from '../assets/logo-banco.png';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const validationError = validateLoginForm({ email, password });
    if (validationError) {
      toast.error(validationError); // 👈 antes era alert(validationError)
      return;
    }
  
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      toast.success('¡Bienvenido a Quantum Capital!'); // 👈 antes era alert('¡Bienvenido...')
    } catch (error) {
      console.error('Error de login:', error);
      if (error instanceof Error) {
        toast.error(error.message); // 👈 antes era alert(error.message)
      } else {
        toast.error('Error desconocido al iniciar sesión.');
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl">
        
        {/* Panel izquierdo con logo */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 md:w-2/5 flex flex-col justify-center items-center">
          <div className="py-8">
            <img src={logoQuantum} alt="Logo Quantum Capital" className="w-34 h-34 mx-auto mb-1" />
            <h1 className="text-3xl font-bold mb-3 text-center">Quantum Capital</h1>
            <p className="text-blue-200 italic text-center mb-6">"Innovando tu futuro financiero"</p>
            <div className="border-t border-blue-700 pt-6 mt-6">
              <p className="text-sm text-blue-200 mb-4">Plataforma de créditos e inversiones diseñada para impulsar tu crecimiento financiero.</p>
              <p className="text-xs text-blue-300">Seguridad y confianza en cada transacción</p>
            </div>
          </div>
        </div>

        {/* Formulario de login */}
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
                  {/* Aquí va el ícono del ojo (mostrar/ocultar contraseña) */}
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
