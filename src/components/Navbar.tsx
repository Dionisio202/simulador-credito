import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants/api';
import AdminMenu from './AdminMenu';

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

  const isAdmin = true; // ✅ Asumimos que el usuario es administrador (reemplazar con auth real si es necesario)

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

        const parents = data.filter(item => item.parent_id === null).sort((a, b) => a.orden - b.orden);
        const children = data.filter(item => item.parent_id !== null);

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
            return { label: parent.label, path: parent.path, hasSubmenu: true, submenu };
          } else {
            return { label: parent.label, path: parent.path, hasSubmenu: false };
          }
        });

        setMenuItems(formattedMenu);
      } catch (err) {
        console.error("Error al cargar el menú:", err);
      }
    };

    fetchMenuItems();
  }, []);

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
                          {section.items.map((subItem: any, sIdx: number) => (
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

          {isAdmin && (
            <AdminMenu />
          )}

          <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-300 ml-4">
            Iniciar sesión
          </Link>
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t">
            <div className="flex flex-col p-4 space-y-4">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <Link to={item.path} className="block text-gray-800 py-2 hover:text-blue-700">{item.label}</Link>
                  {item.hasSubmenu && item.submenu.map((section: any, idx: number) => (
                    <div key={idx} className="ml-4 mt-2">
                      {section.items.map((subItem: any, sIdx: number) => (
                        <Link key={sIdx} to={subItem.path} className="block text-gray-600 py-1 hover:text-blue-600">{subItem.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              <Link to="/login" className="bg-gray-900 text-white text-center font-medium py-2 px-4 rounded transition duration-300">
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