import { useState, FormEvent } from 'react';
import logoQuantum from '../assets/logo-banco.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'admin@quantumcapital.com' && password === '123456') {
      alert('¡Bienvenido a Quantum Capital!');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Left side - Blue gradient panel with logo */}
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

        {/* Right side - Login form */}
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
                <span className="absolute right-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
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
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
             
              <a href="#" className="text-blue-800 hover:text-blue-900 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
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