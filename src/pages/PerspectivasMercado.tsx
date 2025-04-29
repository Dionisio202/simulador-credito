import { Lightbulb, TrendingUp, BarChart2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants/api';

interface Contacto {
  telefono?: string;
  email?: string;
  direccion?: string;
}

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  link: string;
}

interface Perspectiva {
  id: number;
  seccionTipo: 'global' | 'ecuador';
  titulo: string;
  descripcion: string;
  anio: number;
}

interface ConfiguracionGlobal {
  backgroundWhite: string;
  backgroundGray: string;
  backgroundDark: string;
  textLight: string;
}

const PerspectivasMercado = () => {
  const [contacto, setContacto] = useState<Contacto | null>(null);
  const [services, setServices] = useState<Servicio[]>([]);
  const [perspectivasGlobales, setPerspectivasGlobales] = useState<Perspectiva[]>([]);
  const [perspectivaEcuador, setPerspectivaEcuador] = useState<Perspectiva | null>(null);
  const [anioActual, setAnioActual] = useState<number | null>(null);
  const [configColors, setConfigColors] = useState<ConfiguracionGlobal | null>(null);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/configuracion-global`);
        const data = await response.json();
        if (data.length > 0) setConfigColors(data[0]);
      } catch (error) {
        console.error("Error al cargar configuración global:", error);
      }
    };
    fetchConfiguracion();
  }, []);

  useEffect(() => {
    const fetchContacto = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/home-contacto`);
        const data: Contacto = await response.json();
        setContacto(data);
      } catch (error) {
        console.error("Error al cargar contacto:", error);
      }
    };
    fetchContacto();
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/home-servicios`);
        const data: Servicio[] = await response.json();
        const mapped = data.map(serv => ({
          ...serv,
          imagenUrl: `${API_URL}${serv.imagenUrl}`
        }));
        setServices(mapped);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      }
    };
    fetchServicios();
  }, []);

  useEffect(() => {
    const fetchPerspectivas = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/perspectivas-mercado`);
        const data: Perspectiva[] = await response.json();

        const globales = data.filter(p => p.seccionTipo === 'global');
        const ecuador = data.find(p => p.seccionTipo === 'ecuador') || null;

        if (data.length > 0) {
          setAnioActual(data[0].anio);
        }

        setPerspectivasGlobales(globales);
        setPerspectivaEcuador(ecuador);
      } catch (error) {
        console.error('Error al cargar perspectivas:', error);
      }
    };
    fetchPerspectivas();
  }, []);

  const footerServices = services.map(s => ({
    label: s.titulo,
    url: s.link
  }));

  if (!configColors) {
    return <div className="min-h-screen flex justify-center items-center text-gray-600">Cargando...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen ${configColors.backgroundGray} pt-24`}>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-3">
            Perspectivas del <span className="font-bold">Mercado</span> {anioActual}
          </h1>
          <div className="w-24 h-1 bg-blue-300 md:mx-0 mx-auto mb-6"></div>
          <p className="text-blue-100 md:max-w-2xl">
            Análisis actualizado de las tendencias económicas globales, regionales y locales, incluyendo proyecciones de crecimiento, sectores estratégicos y oportunidades de inversión.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perspectivasGlobales.map((item, index) => {
            const Icon = index === 0 ? TrendingUp : index === 1 ? Lightbulb : BarChart2;
            return (
              <div key={item.id} className={`${configColors.backgroundWhite} rounded-lg shadow-md hover:shadow-lg p-6 transition`}>
                <div className="flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.titulo}</h3>
                <p className="text-gray-600 whitespace-normal">{item.descripcion}</p>
              </div>
            );
          })}
        </div>
        {perspectivaEcuador && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{perspectivaEcuador.titulo}</h2>
            <p className="text-gray-600 whitespace-normal">{perspectivaEcuador.descripcion}</p>
          </div>
        )}
      </div>

      <Footer 
        companyName="Quantum Capital"
        description=""
        copyright={`© ${anioActual || '2025'} Quantum Capital. Todos los derechos reservados.`}
        bgColor={configColors.backgroundDark}
        textColor={configColors.textLight}
        servicesTitle="Servicios"
        services={footerServices}
        contactTitle="Contacto"
        phoneNumber={contacto?.telefono || ''}
        email={contacto?.email || ''}
        address={contacto?.direccion || ''}
        footerLinks={[
          { label: "Políticas de Privacidad", url: "#" },
          { label: "Términos y Condiciones", url: "#" },
          { label: "Mapa del Sitio", url: "#" }
        ]}
      />
    </div>
  );
};

export default PerspectivasMercado;
