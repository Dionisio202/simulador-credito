import React, { useEffect, useState } from 'react';
import { createTasa, deleteTasa, getAllTasas, updateTasa } from '../services/investmentService.ts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_URL } from '../constants/api';

interface TasaInversion {
  id: number;
  montoDesde: number;
  montoHasta?: number;
  plazoDesde: number;
  plazoHasta?: number;
  tasa: number;
}

interface InputRangeProps {
  labelDesde: string;
  labelHasta: string;
  valueDesde: number | undefined;
  valueHasta: number | undefined;
  infinito: boolean;
  setInfinito: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeDesde: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeHasta: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectInfinito: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  unidad?: string;
}

const InputRange: React.FC<InputRangeProps> = React.memo(({
  labelDesde,
  labelHasta,
  valueDesde,
  valueHasta,
  infinito,
  onChangeDesde,
  onChangeHasta,
  onSelectInfinito,
  unidad = ""
}) => (
  <div className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
    <div className="font-medium text-gray-700 border-b pb-2">{labelDesde.split(" ")[0]}</div>

    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{labelDesde}</label>
      <div className="flex items-center">
        <input
          type="number"
          value={valueDesde ?? ''}
          onChange={onChangeDesde}
          className="border border-gray-300 p-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="0"
        />
        {unidad && <span className="ml-2 text-gray-600">{unidad}</span>}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{labelHasta}</label>
      <div className="flex items-center gap-2">
        <div className="w-full flex gap-2">
          <select 
            className="border border-gray-300 p-2 rounded text-sm flex-grow-0 w-1/3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={infinito ? 'infinito' : 'valor'}
            onChange={onSelectInfinito}
          >
            <option value="valor">Valor</option>
            <option value="infinito">Sin límite</option>
          </select>
          <div className="relative flex-grow">
            <input
              type="number"
              value={valueHasta ?? ''}
              onChange={onChangeHasta}
              disabled={infinito}
              placeholder={infinito ? "∞" : ""}
              className={`border border-gray-300 p-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${infinito ? 'bg-gray-100 text-gray-500' : ''}`}
            />
            {infinito && (
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">∞</span>
              </div>
            )}
          </div>
        </div>
        {unidad && !infinito && <span className="text-gray-600">{unidad}</span>}
      </div>
    </div>
  </div>
));
interface ConfiguracionGlobal {
  id: number;
  nombreEmpresa: string;
  logoUrl: string;
  backgroundWhite: string;
}
const ConfigTasasInversion: React.FC = () => {
  const [tasas, setTasas] = useState<TasaInversion[]>([]);
  const [form, setForm] = useState<Partial<TasaInversion>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [montoHastaInfinito, setMontoHastaInfinito] = useState(false);
  const [plazoHastaInfinito, setPlazoHastaInfinito] = useState(false);
    const [configuracion, setConfiguracion] = useState<ConfiguracionGlobal | null>(null);
  
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

  const generarPDF = () => {
    const fechaActual = new Date().toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });
  
    // Encabezado institucional
    pdf.setFontSize(16);
    pdf.text(configuracion?.nombreEmpresa || '', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
    pdf.setFontSize(12);
    pdf.text(`Reporte de Tasas de Inversión por Rango - ${fechaActual}`, pdf.internal.pageSize.getWidth() / 2, 80, { align: 'center' });
  
    // Encabezados de la tabla
    const head = [
      ['Plazo Desde', 'Plazo Hasta', 'Monto Desde', 'Monto Hasta', 'Tasa (%)']
    ];
  
    // Cuerpo de la tabla
    const body = tasas.map(t => [
      `${t.plazoDesde} días`,
      t.plazoHasta != null ? `${t.plazoHasta} días` : '∞',
      `$${t.montoDesde.toLocaleString()}`,
      t.montoHasta != null ? `$${t.montoHasta.toLocaleString()}` : '∞',
      `${t.tasa}%`
    ]);
  
    // Generar la tabla con paginación automática
    autoTable(pdf, {
      head,
      body,
      startY: 100,
      margin: { top: 100 },
      styles: {
        halign: 'center',
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 40,
        fontStyle: 'bold',
      },
      didDrawPage: (data) => {
        // Número de página al pie
        const pageCount = pdf.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(`Página ${data.pageNumber} de ${pageCount}`, pdf.internal.pageSize.getWidth() - 120, pdf.internal.pageSize.getHeight() - 20);
      }
    });
  
    pdf.save(`Reporte_Tasas_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  

  useEffect(() => {
    const fetchTasas = async () => {
      try {
        const data = await getAllTasas();
        // Ordenar las tasas por plazo primero y luego por monto
        const ordenadas = [...data].sort((a, b) => {
          // Primero ordenar por plazoDesde
          if (a.plazoDesde !== b.plazoDesde) {
            return a.plazoDesde - b.plazoDesde;
          }
          // Si tienen el mismo plazoDesde, ordenar por montoDesde
          return a.montoDesde - b.montoDesde;
        });
        setTasas(ordenadas);
      } catch (err) {
        console.error('Error al cargar tasas:', err);
      }
    };

    fetchTasas();
  }, []);

  const limpiarFormulario = () => {
    setForm({});
    setEditId(null);
    setError("");
    setMontoHastaInfinito(false);
    setPlazoHastaInfinito(false);
  };

  // Función de validación corregida que permite rangos de montos iguales en diferentes plazos
// Función de validación modificada que permite múltiples rangos con plazos infinitos
const validarRango = (tasa: Partial<TasaInversion>, excluirId?: number) => {
  // Validación de campos requeridos
  if (
    tasa.montoDesde == null ||
    tasa.plazoDesde == null ||
    tasa.tasa == null
  ) return "Todos los campos requeridos excepto los campos 'hasta'";

  // Validación de valores negativos
  if (
    tasa.montoDesde < 0 ||
    (tasa.montoHasta != null && tasa.montoHasta < 0) ||
    tasa.plazoDesde < 0 ||
    (tasa.plazoHasta != null && tasa.plazoHasta < 0) ||
    tasa.tasa < 0
  ) return "No se permiten valores negativos";

  // Validación de tasa cero
  if (tasa.tasa === 0) return "La tasa no puede ser cero";

  // Validación de rangos invertidos en monto
  if (tasa.montoHasta != null && tasa.montoDesde >= tasa.montoHasta)
    return "Monto desde debe ser menor que monto hasta";

  // Validación de rangos invertidos en plazo
  if (tasa.plazoHasta != null && tasa.plazoDesde >= tasa.plazoHasta)
    return "Plazo desde debe ser menor que plazo hasta";

  // Verificar existencia de rangos infinitos previos para montos (mantener como estaba)
  const tasasTieneInfinitoMonto = tasas.some(t => 
    t.id !== excluirId && t.montoHasta === undefined
  );

  if (tasa.montoHasta === undefined && tasasTieneInfinitoMonto)
    return "Ya existe un rango con monto hasta infinito";

  // ELIMINADO: La restricción de un único rango con plazo infinito
  // Los rangos de plazos pueden repetirse, incluso con plazo hasta infinito

  // Convertir undefined a Infinity para comparaciones
  const desdeMonto1 = tasa.montoDesde;
  const hastaMonto1 = tasa.montoHasta ?? Infinity;
  const desdePlazo1 = tasa.plazoDesde;
  const hastaPlazo1 = tasa.plazoHasta ?? Infinity;

  // Verificar solapamiento con otros rangos
  const solapado = tasas.some(t => {
    if (t.id === excluirId) return false;

    const desdeMonto2 = t.montoDesde;
    const hastaMonto2 = t.montoHasta ?? Infinity;
    const desdePlazo2 = t.plazoDesde;
    const hastaPlazo2 = t.plazoHasta ?? Infinity;

    // Verificamos si ambos rangos se solapan (montos Y plazos)
    const montosSolapan = (desdeMonto1 < hastaMonto2) && (hastaMonto1 > desdeMonto2);
    const plazosSolapan = (desdePlazo1 < hastaPlazo2) && (hastaPlazo1 > desdePlazo2);

    // Un rango para ser considerado solapado debe solaparse tanto en montos como en plazos
    return montosSolapan && plazosSolapan;
  });

  if (solapado)
    return "El rango se solapa con otro existente";

  // Verificar que no existan rangos con los mismos montos EN EL MISMO PLAZO
  const EPSILON = 0.001; // Tolerancia pequeña para comparaciones de punto flotante
  
  const mismoRangoDeMonto = tasas.some(t => {
    if (t.id === excluirId) return false;
    
    // Comprobamos si el monto desde y hasta son aproximadamente iguales
    const montoDesdeIgual = Math.abs(t.montoDesde - desdeMonto1) < EPSILON;
    const montoHastaIgual = 
      (t.montoHasta === undefined && tasa.montoHasta === undefined) || 
      (t.montoHasta !== undefined && tasa.montoHasta !== undefined && 
       Math.abs(t.montoHasta - tasa.montoHasta) < EPSILON);
    
    // Verificamos si estos rangos están en el mismo plazo
    // Para ello, comprobamos si hay solapamiento de plazos
    const plazosSolapan = (t.plazoDesde < hastaPlazo1) && ((t.plazoHasta ?? Infinity) > desdePlazo1);
    
    // Solo es un problema si son los mismos montos Y están en el mismo plazo
    return montoDesdeIgual && montoHastaIgual && plazosSolapan;
  });

  if (mismoRangoDeMonto)
    return "Ya existe un rango con los mismos montos en el mismo rango de plazo.";

  return null;
};

  const handleAdd = async () => {
    const formToSubmit = { ...form };
    if (montoHastaInfinito) formToSubmit.montoHasta = undefined;
    if (plazoHastaInfinito) formToSubmit.plazoHasta = undefined;

    const error = validarRango(formToSubmit);
    if (error) return setError(error);

    try {
      const nuevaTasa = await createTasa(formToSubmit as Omit<TasaInversion, 'id'>);
      
      // Añadir la nueva tasa y ordenar el array
      const tasasActualizadas = [...tasas, nuevaTasa].sort((a, b) => {
        // Primero ordenar por plazoDesde
        if (a.plazoDesde !== b.plazoDesde) {
          return a.plazoDesde - b.plazoDesde;
        }
        // Si tienen el mismo plazoDesde, ordenar por montoDesde
        return a.montoDesde - b.montoDesde;
      });
      
      setTasas(tasasActualizadas);
      limpiarFormulario();
    } catch (err) {
      console.error("Error al agregar:", err);
    }
  };

  const handleUpdate = async () => {
    const formToSubmit = { ...form };
    if (montoHastaInfinito) formToSubmit.montoHasta = undefined;
    if (plazoHastaInfinito) formToSubmit.plazoHasta = undefined;

    const validacion = validarRango(formToSubmit, editId!);
    if (validacion) {
      setError(validacion);
      return;
    }

    try {
      await updateTasa(editId!, formToSubmit as Omit<TasaInversion, 'id'>);
      const actualizada = { id: editId!, ...formToSubmit } as TasaInversion;
      
      // Actualizar la tasa y ordenar el array
      const tasasActualizadas = tasas.map(t => (t.id === editId ? actualizada : t))
        .sort((a, b) => {
          // Primero ordenar por plazoDesde
          if (a.plazoDesde !== b.plazoDesde) {
            return a.plazoDesde - b.plazoDesde;
          }
          // Si tienen el mismo plazoDesde, ordenar por montoDesde
          return a.montoDesde - b.montoDesde;
        });
      
      setTasas(tasasActualizadas);
      limpiarFormulario();
    } catch (err) {
      console.error('Error al actualizar tasa:', err);
    }
  };

  const startEdit = (tasa: TasaInversion) => {
    setForm(tasa);
    setEditId(tasa.id);
    setError("");
    setMontoHastaInfinito(tasa.montoHasta === undefined);
    setPlazoHastaInfinito(tasa.plazoHasta === undefined);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este rango de tasa?")) {
      try {
        await deleteTasa(id); // llamar a la API
        setTasas(tasas.filter(t => t.id !== id)); // actualizar UI
        if (editId === id) limpiarFormulario();
      } catch (err) {
        console.error('Error al eliminar tasa:', err);
        alert('No se pudo eliminar la tasa. Intenta nuevamente.');
      }
    }
  };

  return ( 
    <div className={`min-h-screen ${configuracion?.backgroundWhite} p-4 md:p-8 pt-24 md:pt-32`}> 
      <div className="max-w-5xl mx-auto bg-gray-100 p-4 md:p-6 rounded-lg shadow-md"> 
      <div className="flex justify-end mb-4">
  <button
    onClick={generarPDF}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
  >
    Exportar tabla a PDF
  </button>
</div>

        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
          Configuración de Tasas por Rango 
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg border mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {editId === null ? "Agregar nuevo rango de tasa" : "Editar rango de tasa"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Cambiando el orden: Primero Plazos */}
            <InputRange 
              labelDesde="Plazo desde"
              labelHasta="Plazo hasta"
              valueDesde={form.plazoDesde}
              valueHasta={form.plazoHasta}
              infinito={plazoHastaInfinito}
              setInfinito={setPlazoHastaInfinito}
              onChangeDesde={(e) => {
                const valor = e.target.value;
                setForm({ 
                  ...form, 
                  plazoDesde: valor === '' ? undefined : parseInt(valor)
                });
              }}
              onChangeHasta={(e) => {
                const value = e.target.value;
                setForm({ ...form, plazoHasta: value === '' ? undefined : parseInt(value) });
              }}
              onSelectInfinito={(e) => {
                const value = e.target.value;
                if (value === 'infinito') {
                  setPlazoHastaInfinito(true);
                  setForm({ ...form, plazoHasta: undefined });
                } else {
                  setPlazoHastaInfinito(false);
                }
              }}
              unidad="días"
            />
            
            {/* Luego Montos */}
            <InputRange 
              labelDesde="Monto desde ($)"
              labelHasta="Monto hasta ($)"
              valueDesde={form.montoDesde}
              valueHasta={form.montoHasta}
              infinito={montoHastaInfinito}
              setInfinito={setMontoHastaInfinito}
              onChangeDesde={(e) => {
                const valor = e.target.value;
                setForm({ 
                  ...form, 
                  montoDesde: valor === '' ? undefined : parseFloat(valor)
                });
              }}
              onChangeHasta={(e) => {
                const value = e.target.value;
                setForm({ ...form, montoHasta: value === '' ? undefined : parseFloat(value) });
              }}
              onSelectInfinito={(e) => {
                const value = e.target.value;
                if (value === 'infinito') {
                  setMontoHastaInfinito(true);
                  setForm({ ...form, montoHasta: undefined });
                } else {
                  setMontoHastaInfinito(false);
                }
              }}
            />
          </div>
          
          {/* Tasa de interés */}
          <div className="mb-6">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-medium text-gray-700 border-b pb-2 mb-3">Tasa</div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tasa de interés</label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.01"
                  value={form.tasa ?? ''}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setForm({ 
                      ...form, 
                      tasa: valor === '' ? undefined : parseFloat(valor)
                    });
                  }}
                  className="border border-gray-300 p-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            {editId === null ? (
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar rango
              </button>
            ) : (
              <>
                <button
                  onClick={limpiarFormulario}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Guardar cambios
                </button>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Rangos de tasas configurados</h3>
          
          {tasas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 font-medium">No hay rangos de tasas configurados</p>
              <p className="text-sm text-gray-400 mt-1">Use el formulario superior para agregar un nuevo rango</p>
            </div>
          ) : (
            <table id="tabla-tasas" className="w-full table-auto border bg-white rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  {/* Cambiando el orden de las columnas */}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Plazo Desde</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Plazo Hasta</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monto Desde</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monto Hasta</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tasa (%)</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasas.map((tasa) => (
                  <tr key={tasa.id} className="border-t hover:bg-gray-50">
                    {/* Cambiando el orden de las celdas */}
                    <td className="px-4 py-3 text-gray-800">{tasa.plazoDesde} días</td>
                    <td className="px-4 py-3 text-gray-800">{tasa.plazoHasta != null ? `${tasa.plazoHasta} días` : '∞ (Sin límite)'}</td>
                    <td className="px-4 py-3 text-gray-800">${tasa.montoDesde.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-800">{tasa.montoHasta != null ? `$${tasa.montoHasta.toLocaleString()}` : '∞ (Sin límite)'}</td>
                    <td className="px-4 py-3 text-gray-800">{tasa.tasa}%</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => startEdit(tasa)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(tasa.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigTasasInversion;