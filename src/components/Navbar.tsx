import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/api';

interface RawMenuItem {
  id: number;
  parent_id: number | null;
  label: string;
  path: string;
  category: string | null;
  orden: number;
}

interface ConfiguracionGlobal {
  id: number;
  nombreEmpresa: string;
  logoUrl: string;
  backgroundWhite: string;
}

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionGlobal | null>(null);

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!token) return;

    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`${API_URL}/configuration/navbar`);
        const data: RawMenuItem[] = await res.json();

        const allowed = data.filter(item => {
          // Mostrar menú "Administración" a Admin y Financiero
          if (item.id === 7) {
            return role === 'Admin' || role === 'Asesor';
          }
        
          // Filtrar hijos del menú Administración
          if (item.parent_id === 7) {
            if (role === 'Admin') return true;
            if (role === 'Asesor') return item.id === 8 || item.id === 10;
            return false;
          }
        
          // Otros menús visibles a todos
          return true;
        });
        

        const parents = allowed.filter(item => item.parent_id === null).sort((a, b) => a.orden - b.orden);
        const children = allowed.filter(item => item.parent_id !== null);

        const groupedChildren = children.reduce((acc, item) => {
          const parent = item.parent_id!;
          if (!acc[parent]) acc[parent] = {};
          if (!acc[parent][item.category!]) acc[parent][item.category!] = [];
          acc[parent][item.category!].push({ label: item.label, path: item.path });
          return acc;
        }, {} as Record<number, Record<string, { label: string; path: string }[]>>);

        const formattedMenu = parents.map(parent => {
          const submenuData = groupedChildren[parent.id];
          if (submenuData) {
            const submenu = Object.entries(submenuData).map(([category, items]) => ({ category, items }));
            return { label: parent.label, path: parent.path, hasSubmenu: true, submenu, id: parent.id };
          } else {
            return { label: parent.label, path: parent.path, hasSubmenu: false, id: parent.id };
          }
        });

        setMenuItems(formattedMenu);
      } catch (err) {
        console.error("Error al cargar el menú:", err);
      }
    };

    fetchMenuItems();
  }, [role]);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const res = await fetch(`${API_URL}/configuration/configuracion-global`);
        const data = await res.json();
        setConfiguracion(data[0]);
      } catch (err) {
        console.error("Error al cargar configuración global:", err);
      }
    };

    fetchConfiguracion();
  }, []);

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? `${configuracion?.backgroundWhite} shadow-md` : `${configuracion?.backgroundWhite}`}`}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20 relative">
        <div className="flex items-center space-x-2">
          {configuracion && (
            <>
              <img src={`${API_URL}${configuracion.logoUrl}`} alt={configuracion.nombreEmpresa} className="w-10 h-10" />
              <span className="font-bold text-xl text-gray-800">{configuracion.nombreEmpresa}</span>
            </>
          )}
        </div>

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

        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => item.hasSubmenu && setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link to={item.path} className={`flex items-center h-full border-b-2 px-1 transition-colors duration-300 ${activeMenu === index ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-700 hover:text-gray-800'}`}>
                {item.label}
                {item.hasSubmenu && (
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>

              {item.hasSubmenu && activeMenu === index && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-lg transition-all duration-300 border-t border-gray-200">
                  <div className="px-4 py-6">
                    {item.submenu.map((section: any, idx: number) => (
                      <div key={idx} className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">{section.category}</h3>
                        <ul className="space-y-2">
                          {section.items
                            .filter((subItem: any) => {
                              if (subItem.label === 'Configuración de Interfaz') {
                                return role === 'Admin';
                              }
                              return true;
                            })
                            .map((subItem: any, sIdx: number) => (
                              <li key={sIdx}>
                                <Link to={subItem.path} className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
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

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300 ml-4"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-300 ml-4">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
