import { Lightbulb, TrendingUp, BarChart2 } from 'lucide-react';

const PerspectivasMercado = () => {
  const secciones = [
    {
      icono: TrendingUp,
      titulo: "Tendencias Globales",
      descripcion:
        "El Fondo Monetario Internacional (FMI) proyecta un crecimiento económico mundial del 2,8% para 2025, una disminución respecto al 3,3% de 2024, debido a tensiones comerciales y políticas proteccionistas.",
    },
    {
      icono: Lightbulb,
      titulo: "Sectores Estratégicos",
      descripcion:
        "Los sectores de energías renovables, tecnología financiera (FinTech) y salud digital continúan mostrando un crecimiento significativo, atrayendo inversiones a nivel global.",
    },
    {
      icono: BarChart2,
      titulo: "Proyecciones Económicas",
      descripcion:
        "En América Latina, se espera un crecimiento del 2,5% en 2025, impulsado por la recuperación económica en países como Argentina y la estabilización de las tasas de interés.",
    },
  ];

  const perspectivaEcuador = {
    titulo: "Perspectivas para Ecuador",
    descripcion:
      "El Banco Central del Ecuador proyecta un crecimiento del PIB del 2,8% para 2025, respaldado por un aumento en el consumo privado, inversiones en infraestructura y nuevos acuerdos comerciales.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-3">
            Perspectivas del <span className="font-bold">Mercado</span> 2025
          </h1>
          <div className="w-24 h-1 bg-blue-300 md:mx-0 mx-auto mb-6"></div>
          <p className="text-blue-100 md:max-w-2xl">
            Análisis actualizado de las tendencias económicas globales, regionales y locales, incluyendo proyecciones de crecimiento, sectores estratégicos y oportunidades de inversión.
          </p>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secciones.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 transition"
            >
              <div className="flex items-center justify-center mb-4">
                <item.icono className="text-blue-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{item.titulo}</h3>
              <p className="text-gray-600">{item.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Perspectiva Ecuador */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{perspectivaEcuador.titulo}</h2>
          <p className="text-gray-600">{perspectivaEcuador.descripcion}</p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Manténgase Informado</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Suscríbase para recibir las últimas actualizaciones sobre las perspectivas económicas y oportunidades de inversión directamente en su correo electrónico.
          </p>
     
        </div>
      </div>
    </div>
  );
};

export default PerspectivasMercado;
