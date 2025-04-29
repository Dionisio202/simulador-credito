
import Footer from '../components/Footer';
import { API_URL } from '../constants/api';

import { useEffect, useState } from "react";


interface QuienesSomos {
  id: number;
  titulo: string;
  descripcion_1: string;
  descripcion_2?: string;
  imagen_url: string;
}

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  link: string;
}

interface Testimonio {
  id: number;
  nombreCliente: string;
  cargo: string;
  empresa: string;
  comentario: string;
  calificacion: number;
}

const Home = () => {
  interface Banner {
    title: string;
    highlight: string;
    subtitle: string;
    image: string;
  }
  interface Contacto {
    telefono?: string;
    email?: string;
    direccion?: string;
  }
  

  const [banners, setBanners] = useState<Banner[]>([]);
  const [quienesSomos, setQuienesSomos] = useState<QuienesSomos | null>(null);
  const [services, setServices] = useState<Servicio[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonio[]>([]);
  const [contacto, setContacto] = useState<Contacto | null>(null);
  const [colores, setColores] = useState({
    backgroundWhite: 'bg-white',
    backgroundGray: 'bg-gray-50',
    backgroundDark: 'bg-gray-900',
    textLight: 'text-white',
  });
  useEffect(() => {
    const fetchColores = async () => {
      try {
        const res = await fetch(`${API_URL}/configuration/configuracion-global`);
        const data = await res.json();
        if (data.length > 0) {
          setColores({
            backgroundWhite: data[0].backgroundWhite || 'bg-white',
            backgroundGray: data[0].backgroundGray || 'bg-gray-50',
            backgroundDark: data[0].backgroundDark || 'bg-gray-900',
            textLight: data[0].textLight || 'text-white',
          });
        }
      } catch (err) {
        console.error("Error al cargar configuración global de colores:", err);
      }
    };
  
    fetchColores();
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
  const fetchTestimonios = async () => {
    try {
      const response = await fetch(`${API_URL}/configuration/home-testimonios`);
      const data: Testimonio[] = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error al cargar testimonios:", error);
    }
  };

  fetchTestimonios();
}, []);


useEffect(() => {
  const fetchServicios = async () => {
    try {
      const response = await fetch(`${API_URL}/configuration/home-servicios`);
      const data: Servicio[] = await response.json();
      // Mapea las rutas relativas a rutas absolutas si es necesario
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
    const fetchQuienesSomos = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/quienes-somos`);
        const data = await response.json();
        setQuienesSomos(data[0]); // asumiendo que solo tienes un registro
      } catch (error) {
        console.error('Error al cargar la sección Quiénes Somos:', error);
      }
    };
  
    fetchQuienesSomos();
  }, []);
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration/home-banner`);
        const data = await response.json();
  
        // Transformar los datos para que tengan el formato necesario
        const mappedData = data.map((item: { titulo: string; subtitulo: any; imagenUrl: any; }) => ({
          title: item.titulo,
          highlight: item.titulo.split(" ")[0], // Asume que lo primero es el "highlight"
          subtitle: item.subtitulo,
          image: `${API_URL}${item.imagenUrl}`,
        }));
  
        setBanners(mappedData);
      } catch (error) {
        console.error("Error al cargar banners:", error);
      }
    };
  
    fetchBanners();
  }, []);
  const footerServices = services.map(s => ({
    label: s.titulo,
    url: s.link
  }));
  
  return (
    <div className={`flex flex-col min-h-screen ${colores.backgroundWhite}`}>
     {/* Banner principal dinámico */}
     {banners.map((banner, index) => (
  <section
    key={index}
    className="relative h-screen bg-cover bg-center flex flex-col items-start justify-center px-12 md:px-24"
    style={{ backgroundImage: `url(${banner.image})` }}
  >
    <div className="absolute inset-0"></div>
    <div className="relative z-10 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
        <span className="font-bold">{banner.highlight}</span>{" "}
        {banner.title.replace(banner.highlight, "").trim()}
      </h1>
      <p className="text-xl text-white mb-8 leading-relaxed">
        {banner.subtitle}
      </p>
    </div>
  </section>
))}



     {/* Quiénes somos (dinámico) */}
{quienesSomos && (
  <section className={`py-24 ${colores.backgroundWhite}`}>
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="md:w-1/2">
        <img
          src={`${API_URL}${quienesSomos.imagen_url}`}
          alt="Quiénes somos"
          className="rounded-md shadow-xl w-full h-auto object-cover"
        />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-light text-gray-800 mb-4">
          {quienesSomos.titulo}
        </h2>
        <div className="w-24 h-1 bg-blue-600 mb-8"></div>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          {quienesSomos.descripcion_1}
        </p>
        {quienesSomos.descripcion_2 && (
          <p className="text-gray-600 text-lg leading-relaxed">
            {quienesSomos.descripcion_2}
          </p>
        )}
      </div>
    </div>
  </section>
)}


    {/* Servicios */}
<section className={`py-24 ${colores.backgroundGray}`}>
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-light text-gray-800">
        Nuestros <span className="font-bold">Servicios</span>
      </h2>
      <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div key={index} className="bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
          <img src={service.imagenUrl} alt={service.titulo} className="w-full h-48 object-cover" />
          <div className="p-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{service.titulo}</h3>
            <p className="text-gray-600 mb-6">{service.descripcion}</p>
            <a href={service.link} className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
              Conocer más
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


     

   {/* Testimonios */}
<section className={`py-24 ${colores.backgroundGray}`}>
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-light text-gray-800">
        Lo que dicen nuestros <span className="font-bold">Clientes</span>
      </h2>
      <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((t, index) => (
        <div key={index} className="bg-white p-8 rounded-md shadow-lg">
          <div className="text-yellow-400 mb-4">
            {"★".repeat(t.calificacion)}
          </div>
          <p className="text-gray-600 italic mb-6">"{t.comentario}"</p>
          <div>
            <p className="font-semibold text-gray-800">{t.nombreCliente}</p>
            <p className="text-gray-500 text-sm">
              {t.cargo}, {t.empresa}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<Footer 
  // Información general
  companyName="Quantum Capital"
  description=""
  copyright="© 2025 Quantum Capital. Todos los derechos reservados."

  // Colores principales (opcionales)
  bgColor={`${colores.backgroundDark}`}
  textColor={`${colores.textLight}`}

  // Sección de servicios (dinámico)
  servicesTitle="Servicios"
  services={footerServices}

  // Sección de contacto (dinámico)
  contactTitle="Contacto"
  phoneNumber={contacto?.telefono || ''}
  email={contacto?.email || ''}
  address={contacto?.direccion || ''}

  // Enlaces del pie de página
  footerLinks={[
    { label: "Políticas de Privacidad", url: "#" },
    { label: "Términos y Condiciones", url: "#" },
    { label: "Mapa del Sitio", url: "#" }
  ]}
/>


    </div>
  );
};

export default Home;
