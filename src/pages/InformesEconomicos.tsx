import { useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';

const InformesEconomicos = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Informes con categorías añadidas para filtrado
  const informes = [
    {
      titulo: "Reporte Anual 2024",
      descripcion: "Análisis de tendencias globales, crecimiento de mercados emergentes y evolución de inversiones.",
      archivo: "/reporte_anual.pdf",
      categoria: "anual",
      fecha: "Diciembre 2024",
      paginas: 42,
      autor: "Departamento de Investigación Económica"
    },
    {
      titulo: "Perspectivas Económicas 2025",
      descripcion: "Proyecciones de inflación, tasas de interés y oportunidades estratégicas de inversión para 2025.",
      archivo: "/perspectivas.pdf",
      categoria: "proyeccion",
      fecha: "Noviembre 2024",
      paginas: 36,
      autor: "Equipo de Análisis Estratégico"
    },
    {
      titulo: "Mercados Emergentes: Análisis 2024",
      descripcion: "Evaluación de riesgos y oportunidades en América Latina y Asia para proyectos de inversión.",
      archivo: "/Mercados%20Emergentes.pdf",
      categoria: "mercados",
      fecha: "Octubre 2024",
      paginas: 28,
      autor: "División Internacional"
    },
    {
      titulo: "Informe de Sostenibilidad Financiera",
      descripcion: "Estudio del impacto de inversiones responsables en portafolios diversificados de Quantum Capital.",
      archivo: "/Sostenibilidad.pdf",
      categoria: "sostenibilidad",
      fecha: "Septiembre 2024",
      paginas: 34,
      autor: "Comité de Inversiones Sostenibles"
    }
  ];

  // Filtrar informes según categoría y término de búsqueda
  const informesFiltrados = informes.filter(informe => {
    const matchCategoria = filtroCategoria === 'todos' || informe.categoria === filtroCategoria;
    const matchBusqueda = informe.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                          informe.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Categorías para el filtro
  const categorias = [
    { id: 'todos', nombre: 'Todos los informes' },
    { id: 'anual', nombre: 'Reportes Anuales' },
    { id: 'proyeccion', nombre: 'Proyecciones' },
    { id: 'mercados', nombre: 'Análisis de Mercados' },
    { id: 'sostenibilidad', nombre: 'Sostenibilidad' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24">

      {/* Header de la sección con fondo elegante */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-3">
            Informes <span className="font-bold">Económicos</span>
          </h1>
          <div className="w-24 h-1 bg-blue-300 md:mx-0 mx-auto mb-6"></div>
          <p className="text-blue-100 md:max-w-2xl">
            Acceda a nuestros análisis financieros especializados, proyecciones y reportes que le ayudarán a tomar decisiones informadas en un entorno económico global cambiante.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-12">
        {/* Herramientas de búsqueda y filtrado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative md:w-1/2">
              <input
                type="text"
                placeholder="Buscar por título o contenido..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                    filtroCategoria === categoria.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFiltroCategoria(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mensaje si no hay resultados */}
        {informesFiltrados.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No se encontraron informes que coincidan con su búsqueda.</p>
          </div>
        )}

        {/* Tarjetas de informes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {informesFiltrados.map((informe, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                      {informe.categoria === 'anual' && 'Reporte Anual'}
                      {informe.categoria === 'proyeccion' && 'Proyección Económica'}
                      {informe.categoria === 'mercados' && 'Análisis de Mercado'}
                      {informe.categoria === 'sostenibilidad' && 'Sostenibilidad'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{informe.titulo}</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3">
                    <FileText className="text-blue-600 mb-1" size={20} />
                    <span className="text-xs text-gray-600">{informe.paginas} pág.</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 mb-3">{informe.descripcion}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">Publicado: {informe.fecha}</span>
                  <span>Autor: {informe.autor}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Download size={16} className="text-blue-600 mr-2" />
                  <a
                    href={informe.archivo}
                    download
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    Descargar PDF
                  </a>
                </div>
               
              </div>
            </div>
          ))}
        </div>

        {/* Solicitar informes personalizados */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">¿Necesita un análisis personalizado?</h3>
              <p className="text-gray-600">
                Nuestro equipo de expertos puede preparar informes económicos adaptados a sus necesidades específicas y sectores de interés.
              </p>
            </div>
            <div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium">
                Solicitar informe personalizado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter de informes */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Manténgase informado</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Suscríbase a nuestro boletín mensual para recibir los informes económicos más recientes y análisis exclusivos directamente en su bandeja de entrada.
          </p>
        
        </div>
      </div>
    </div>
  );
};

export default InformesEconomicos;