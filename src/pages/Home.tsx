import invest from '../assets/invest.avif';
import consultoria from '../assets/consultoria.jpeg';
import credito from '../assets/credito-empresarial.webp';
import somos from '../assets/somos.png';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Banner principal con overlay más refinado */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605902711622-cfb43c4437c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700  flex flex-col items-start justify-center px-12 md:px-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
              <span className="font-bold">Quantum</span> Capital
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed">
              Soluciones financieras sofisticadas para un futuro próspero.
            </p>
         
          </div>
        </div>
      </section>

      {/* Sección - Quiénes somos con diseño más elegante */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <img 
              src={somos} 
              alt="Quiénes somos" 
              className="rounded-md shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Sobre <span className="font-bold">Quantum Capital</span></h2>
            <div className="w-24 h-1 bg-blue-600 mb-8"></div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Quantum Capital es una institución líder en asesoría financiera, créditos estratégicos e inversiones de alto impacto. Nuestro equipo de expertos combina innovación y tradición para ofrecer soluciones personalizadas que impulsen el crecimiento de nuestros clientes.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nos distinguimos por nuestro enfoque integral, donde cada decisión financiera se analiza en el contexto completo de sus objetivos a corto y largo plazo.
            </p>
          </div>
        </div>
      </section>

      {/* Sección - Nuestros Servicios con diseño más refinado */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800">Nuestros <span className="font-bold">Servicios</span></h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <img 
                src={credito}
                alt="Créditos Empresariales" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Créditos Empresariales</h3>
                <p className="text-gray-600 mb-6">Financiamos sus proyectos con tasas competitivas diseñadas específicamente para optimizar el retorno de su inversión.</p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Conocer más 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <img 
                src={invest}
                alt="Inversiones Inteligentes" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Inversiones Inteligentes</h3>
                <p className="text-gray-600 mb-6">Desarrollamos estrategias de inversión personalizadas para maximizar su patrimonio mediante instrumentos seguros y rentables.</p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Conocer más 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <img 
                src={consultoria}
                alt="Consultoría Financiera" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Consultoría Financiera</h3>
                <p className="text-gray-600 mb-6">Ofrecemos asesoría personalizada con un enfoque integral para alcanzar sus objetivos financieros a corto y largo plazo.</p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Conocer más 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección - Ventajas competitivas con diseño más refinado */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-800">¿Por qué elegir <span className="font-bold">Quantum Capital</span>?</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Servicio Personalizado</h3>
                  <p className="text-gray-600 leading-relaxed">Nuestros asesores desarrollan estrategias adaptadas específicamente a sus necesidades y objetivos únicos.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Tecnología Avanzada</h3>
                  <p className="text-gray-600 leading-relaxed">Plataformas digitales seguras y eficientes que agilizan todos sus procesos financieros.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Experiencia Comprobada</h3>
                  <p className="text-gray-600 leading-relaxed">Más de una década de excelencia en el sector financiero respaldando cada una de nuestras soluciones.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Soluciones Diversificadas</h3>
                  <p className="text-gray-600 leading-relaxed">Amplia gama de productos financieros diseñados para cada etapa de su crecimiento patrimonial y empresarial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de testimonios - Nueva */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800">Lo que dicen nuestros <span className="font-bold">Clientes</span></h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-md shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">"Quantum Capital transformó nuestra visión financiera. Su asesoría nos permitió expandir nuestro negocio mientras optimizábamos recursos."</p>
              <div>
                <p className="font-semibold text-gray-800">Carlos Mendoza</p>
                <p className="text-gray-500 text-sm">Director Financiero, Grupo Avance</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-md shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">"Las estrategias de inversión personalizadas han superado consistentemente nuestras expectativas. Un equipo que realmente entiende nuestras metas."</p>
              <div>
                <p className="font-semibold text-gray-800">Patricia Valencia</p>
                <p className="text-gray-500 text-sm">Empresaria, Sector Tecnológico</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-md shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">"Los créditos estructurados que obtuvimos a través de Quantum Capital nos permitieron consolidar nuestra expansión internacional con confianza."</p>
              <div>
                <p className="font-semibold text-gray-800">Miguel Santana</p>
                <p className="text-gray-500 text-sm">CEO, Innovate Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto - Nueva */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-blue-600 text-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-12">
                <h2 className="text-3xl font-semibold mb-6">Contáctenos</h2>
                <p className="mb-8">Nuestros expertos están listos para ayudarle a alcanzar sus objetivos financieros.</p>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+593 9 8765 4321</span>
                </div>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contacto@quantumcapital.com</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Av. Libertad 1234, Quito, Ecuador</span>
                </div>
              </div>
              <div className="md:w-1/2 bg-white p-12">
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Nombre</label>
                    <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" type="text" id="name" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Correo Electrónico</label>
                    <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" type="email" id="email" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">Mensaje</label>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" id="message" rows={4}></textarea>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300">Enviar mensaje</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer más elegante */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-semibold text-white mb-4">Quantum Capital</h3>
              <p className="mb-6 max-w-md">Construyendo confianza y futuro financiero para nuestros clientes en todo el mundo desde hace más de una década.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Créditos Empresariales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Inversiones Inteligentes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Consultoría Financiera</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Planificación Patrimonial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+593 9 8765 4321</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contacto@quantumcapital.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Av. Libertad 1234, Quito, Ecuador</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; 2025 Quantum Capital. Todos los derechos reservados.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-8 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-white transition">Políticas de Privacidad</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition">Términos y Condiciones</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition">Mapa del Sitio</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;