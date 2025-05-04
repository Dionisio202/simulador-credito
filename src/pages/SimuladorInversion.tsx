import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Decimal from 'decimal.js';
import { getAllTasas } from '../services/investmentService.ts';

interface TasaInversion {
  id: number;
  montoDesde: number;
  montoHasta?: number;
  plazoDesde: number;
  plazoHasta?: number;
  tasa: number;
}

const SimuladorInversion: React.FC = () => {
  const [capital, setCapital] = useState<number | null>(null);
  const [plazo, setPlazo] = useState<number | null>(null);
  const [plazoTipo, setPlazoTipo] = useState<'dias' | 'meses'>('dias');
  const [tasas, setTasas] = useState<TasaInversion[]>([]);
  const [tasaAplicada, setTasaAplicada] = useState<TasaInversion | null>(null);
  const [interesNeto, setInteresNeto] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);

  // Reset results when inputs change
  useEffect(() => {
    if (tasaAplicada || interesNeto !== null) {
      setTasaAplicada(null);
      setInteresNeto(null);
    }
  }, [capital, plazo, plazoTipo]);

  const [plazoMinimoDisponible, setPlazoMinimoDisponible] = useState<number | null>(null);

useEffect(() => {
  getAllTasas().then((data) => {
    setTasas(data);
    
    // Obtener el menor plazoDesde
    const plazoMin = Math.min(...data.map(t => t.plazoDesde));
    console.log('Plazo mínimo disponible:', plazoMin);
    setPlazoMinimoDisponible(plazoMin);
  }).catch(console.error);
}, []);

  useEffect(() => {
    getAllTasas().then(setTasas).catch(console.error);
  }, []);

  const minMonto = tasas.length > 0 ? Math.min(...tasas.map(t => t.montoDesde)) : 0;
  const maxMonto = tasas.length > 0 ? Math.max(...tasas.map(t => t.montoHasta ?? Infinity)) : Infinity;

  const getPlazoDiasDesdeMeses = (meses: number): number | null => {
    if (!plazoMinimoDisponible) {
      toast.error('Aún no se ha cargado el plazo mínimo disponible');
      return null;
    }
  
    if (meses < 1 || meses > 60) {
      toast.error(`El plazo en meses debe estar entre 1 y 60`);
      return null;
    }
  
    // Primer mes = plazoMinimoDisponible, cada mes adicional suma 30
    const dias = plazoMinimoDisponible + (meses - 1) * 30;
  
    const rango = tasas.find(t =>
      dias >= t.plazoDesde &&
      (t.plazoHasta == null || dias <= t.plazoHasta)
    );
  
    if (!rango) {
      toast.error(`No existe una tasa para ${dias} días (${meses} meses).`);
      return null;
    }
  
    return dias;
  };
  
  

  const calcularResultado = () => {
    if (!capital || isNaN(capital) || capital <= 0) {
      toast.error('Ingresa un capital válido');
      return;
    }
    if (!plazo || isNaN(plazo) || plazo <= 0) {
      toast.error('Ingresa un plazo válido');
      return;
    }
    if (capital < minMonto || capital > maxMonto) {
      toast.warning(`El capital debe estar entre ${minMonto.toLocaleString()} y ${maxMonto === Infinity ? '∞' : maxMonto.toLocaleString()}`);
      return;
    }

    const plazoDias = plazoTipo === 'meses'
      ? getPlazoDiasDesdeMeses(plazo)
      : plazo;

    if (!plazoDias) {
      toast.info('No se encontró un rango de plazo para los meses ingresados');
      return;
    }

    const encontrada = tasas.find(t =>
      capital >= t.montoDesde &&
      (t.montoHasta == null || capital <= t.montoHasta) &&
      plazoDias >= t.plazoDesde &&
      (t.plazoHasta == null || plazoDias <= t.plazoHasta)
    );

    if (!encontrada) {
      toast.info('No se encontró una tasa aplicable para los valores ingresados');
      return;
    }
    const interesNeto = new Decimal(capital)
  .times(new Decimal(encontrada.tasa).div(100))
  .times(new Decimal(plazoDias).div(360))
  .times(0.98)
  .toDecimalPlaces(2)
  .toNumber();
    setInteresNeto(interesNeto);
    
    setTasaAplicada(encontrada);
  };

  const tablaRates = () => {
    if (!tasas.length) return <p>Cargando tasas...</p>;

    const plazos = [...new Set(tasas.map(t => `${t.plazoDesde}-${t.plazoHasta ?? '∞'}`))];
    const montos = [...new Set(tasas.map(t => `${t.montoDesde}-${t.montoHasta ?? '∞'}`))];

    const formatoRango = (rango: string, tipo: string) => {
      const [min, max] = rango.split('-');
      if (tipo === 'plazo') {
        return `De ${min} a ${max === '∞' ? '360' : max} días`;
      } else {
        return max === '∞'
          ? `De USD ${Number(min).toLocaleString()} o más`
          : `De USD ${Number(min).toLocaleString()} a ${Number(max).toLocaleString()}`;
      }
    };

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2">Plazo</th>
            {montos.map(m => (
              <th key={m} className="border px-4 py-2 text-center">{formatoRango(m, 'monto')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plazos.map(p => (
            <tr key={p}>
              <td className="border px-4 py-2">{formatoRango(p, 'plazo')}</td>
              {montos.map(m => {
                const [minM, maxM] = m.split('-').map(v => v === '∞' ? Infinity : parseFloat(v));
                const [minP, maxP] = p.split('-').map(v => v === '∞' ? Infinity : parseFloat(v));
                const found = tasas.find(t =>
                  t.montoDesde === minM && (t.montoHasta ?? Infinity) === maxM &&
                  t.plazoDesde === minP && (t.plazoHasta ?? Infinity) === maxP
                );
                return (
                  <td key={m} className="border px-4 py-2 text-center">
                    {found ? `${found.tasa.toFixed(2)}%` : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handlePlazoTipoChange = (tipo: 'dias' | 'meses') => {
    setPlazoTipo(tipo);
    setPlazo(null); // Reset plazo when changing tipo
  };

  return (
    <div className="min-h-screen pt-24 p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">¿Cómo funciona esta inversión?</h1>
        <p className="mb-6 text-gray-700">
          Esta inversión genera intereses calculados con base anual de 360 días. Se descuenta 2% por impuesto a la renta.
        </p>

        {/* Monto de depósito */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Monto de depósito</label>
          <div className="relative text-center text-4xl font-bold text-gray-800 mb-1"></div>
          <input
            type="number"
            value={capital ?? ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              setCapital(value);
            }}
            className="w-full border-b-2 border-blue-700 text-center text-xl font-semibold outline-none pb-2"
            placeholder="Ingresa el monto"
            min={minMonto}
          />
          <p className="text-sm text-gray-600 mt-1">
            Ingresa un monto entre ${minMonto.toLocaleString()} y ${maxMonto === Infinity ? '∞' : maxMonto.toLocaleString()}
          </p>
        </div>

        {/* Plazo del depósito */}
        {capital != null && capital >= minMonto && capital <= maxMonto && (
          <div className="border rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold mb-3">Plazo del depósito</p>
            <div className="flex gap-4 mb-3">
              <button
                onClick={() => handlePlazoTipoChange('meses')}
                className={`w-full py-2 border rounded ${
                  plazoTipo === 'meses' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                Meses
              </button>
              <button
                onClick={() => handlePlazoTipoChange('dias')}
                className={`w-full py-2 border rounded ${
                  plazoTipo === 'dias' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                Días
              </button>
            </div>
            <input
              type="number"
              min={1}
              value={plazo ?? ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setPlazo(value);
              }}
              className="w-full border rounded p-2 text-center"
              placeholder={`Elige el plazo en ${plazoTipo}`}
            />
          </div>
        )}

        {/* Ver tasa */}
        <p
          className="text-sm text-blue-600 underline cursor-pointer mb-4"
          onClick={() => setModalAbierto(true)}
        >
          Revisa nuestra tasa de interés
        </p>

        {/* Botón calcular */}
        <div className="text-center">
          <button
            onClick={calcularResultado}
            className="bg-green-600 text-white px-8 py-3 rounded font-semibold text-lg shadow hover:bg-green-700 transition"
          >
            Calcular interés
          </button>
        </div>

        {/* Resultado */}
        {tasaAplicada && interesNeto != null && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">El resultado de tu simulación:</h2>
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50 shadow">
              <p className="text-gray-700 font-medium mb-1">
                En {plazo} {plazoTipo === 'meses' ? 'meses' : 'días'} | Tasa {tasaAplicada.tasa.toFixed(2)}%
              </p>
              <p className="text-green-700 text-2xl font-bold mb-1">
                Ganas: ${interesNeto.toFixed(2)}
              </p>
              <p className="text-sm text-green-600 font-medium">
                Recibes al final: ${(capital! + interesNeto).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Modal tabla de tasas */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tabla de Tasas de Interés</h2>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              {tablaRates()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimuladorInversion;