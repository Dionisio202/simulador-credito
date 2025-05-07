import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save, FileText, Calendar, BookOpen, AlignLeft, Loader2, Check, AlertCircle } from 'lucide-react';

interface PerspectivaMercado {
  id: number;
  seccionTipo: string;
  titulo: string;
  descripcion: string;
  anio: number;
}

const PerspectivasMercadoForm: React.FC = () => {
  const [data, setData] = useState<PerspectivaMercado | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'none' }>({ 
    text: '', 
    type: 'none' 
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get<PerspectivaMercado[]>('http://localhost:3000/configuration/perspectivas-mercado')
      .then(res => {
        setData(res.data[0]);
        setMessage({ text: '', type: 'none' });
      })
      .catch(() => {
        setMessage({ text: 'Error al cargar los datos.', type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!data) return;
    const { name, value } = e.target;
    setData({ ...data, [name]: name === 'anio' ? Number(value) : value });
  };

  const handleSubmit = async () => {
    if (!data) return;
    
    setSaving(true);
    setMessage({ text: '', type: 'none' });

    try {
      await axios.put(`http://localhost:3000/configuration/perspectivas-mercado/${data.id}`, data);
      setMessage({ text: 'Perspectiva de mercado actualizada exitosamente.', type: 'success' });
      setEditMode(false);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: 'none' }), 3000);
    } catch (err) {
      setMessage({ text: 'Error al guardar los cambios.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes by fetching fresh data
    fetchData();
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Perspectiva del Mercado</h2>
        <p className="text-gray-500 mt-1">Configure la información sobre la perspectiva del mercado</p>
      </div>

      {message.type !== 'none' && (
        <div className={`mx-6 mt-4 p-4 rounded-md flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check size={20} className="mr-2 text-green-500" />
          ) : (
            <AlertCircle size={20} className="mr-2 text-red-500" />
          )}
          {message.text}
        </div>
      )}

      <div className="p-6">
        <div className={`rounded-lg border ${editMode ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-800">
              Detalles de la Perspectiva
            </h3>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:border-blue-500 transition-colors shadow-sm"
              >
                <Pencil size={18} />
                <span>Editar</span>
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Sección Tipo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="seccionTipo"
                  value={data.seccionTipo}
                  onChange={handleChange}
                  className={`w-full pl-10 py-4 bg-white border ${
                    editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                  } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                  disabled={!editMode}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Año</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="anio"
                  value={data.anio}
                  onChange={handleChange}
                  className={`w-full pl-10 py-4 bg-white border ${
                    editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                  } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                  disabled={!editMode}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-gray-700">Título</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="titulo"
                value={data.titulo}
                onChange={handleChange}
                className={`w-full pl-10 py-4 bg-white border ${
                  editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                disabled={!editMode}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-gray-700">Descripción</label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <AlignLeft size={18} className="text-gray-400 mt-1" />
              </div>
              <textarea
                name="descripcion"
                value={data.descripcion}
                onChange={handleChange}
                className={`w-full pl-10 py-4 bg-white border ${
                  editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                } rounded-md text-lg min-h-[150px] ${!editMode ? 'text-gray-600' : ''}`}
                disabled={!editMode}
                required
              />
            </div>
          </div>

          {editMode && (
            <div className="flex space-x-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium 
                  ${saving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                  transition shadow-sm
                `}
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Guardar cambios</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PerspectivasMercadoForm;