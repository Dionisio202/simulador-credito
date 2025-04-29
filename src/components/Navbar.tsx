import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoQuantum from '../assets/logo-banco.png';
import AdminMenu from './AdminMenu'; // 🔵 NUEVO: Importamos el combobox

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = true; // 🔵 NUEVO: Simulación de admin (luego lo conectas a tu contexto de auth)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Inicio', path: '/' },
    { 
      label: 'Productos', path: '#', hasSubmenu: true,
      submenu: [
        { 
          category: 'PRODUCTOS DESTACADOS',
          items: [
            { label: 'Simulador de Crédito', path: '/simulador-credito' },
            { label: 'Simulador de Inversión', path: '/simulador-inversion' },
          ] 
        }
      ]
    },
    { 
      label: 'Visión del mercado', path: '/vision-mercado', hasSubmenu: true,
      submenu: [
        { 
          category: 'ANÁLISIS DE MERCADO',
          items: [
            { label: 'Informes económicos', path: '/vision-mercado/informes' },
            { label: 'Perspectivas de inversión', path: '/vision-mercado/perspectivas' },
          ]
        }
      ]
    },
  ];

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20 relative">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logoQuantum} alt="Quantum Capital" className="w-10 h-10" />
          <span className="font-bold text-xl text-gray-800">Quantum Capital</span>
        </div>

        {/* Botón Hamburguesa */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-gray-900 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú Principal (Desktop) */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className="relative group"
              onMouseEnter={() => item.hasSubmenu && setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link 
                to={item.path}
                className={`flex items-center h-full border-b-2 px-1 transition-colors duration-300 ${
                  activeMenu === index ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-700 hover:text-gray-800'
                }`}
              >
                {item.label}
                {item.hasSubmenu && (
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>

              {/* Submenú */}
              {item.hasSubmenu && activeMenu === index && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-lg transition-all duration-300 opacity-100 visible border-t border-gray-200">
                  <div className="px-4 py-6">
                    {item.submenu.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">{section.category}</h3>
                        <ul className="space-y-2">
                          {section.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link 
                                to={subItem.path}
                                className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 🔵 NUEVO: Mostrar AdminMenu si el usuario es admin */}
          {isAdmin && (
            <AdminMenu />
          )}

          {/* Botón Iniciar sesión */}
          <Link
            to="/login"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-300 ml-4"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Menú lateral desplegable (Mobile) */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t">
            <div className="flex flex-col p-4 space-y-4">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <Link to={item.path} className="block text-gray-800 py-2 hover:text-blue-700">
                    {item.label}
                  </Link>
                  {item.hasSubmenu && item.submenu?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="ml-4 mt-2">
                      {section.items.map((subItem, subIndex) => (
                        <Link 
                          key={subIndex}
                          to={subItem.path}
                          className="block text-gray-600 py-1 hover:text-blue-600"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              <Link
                to="/login"
                className="bg-gray-900 text-white text-center font-medium py-2 px-4 rounded transition duration-300"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;