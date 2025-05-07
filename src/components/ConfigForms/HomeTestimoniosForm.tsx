import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save, User, Briefcase, Building, MessageSquare, Star, Loader2, Check, AlertCircle } from 'lucide-react';

interface HomeTestimonio {
  id: number;
  nombreCliente: string;
  cargo: string;
  empresa: string;
  comentario: string;
  calificacion: number;
}

const HomeTestimoniosForm: React.FC = () => {
  const [formData, setFormData] = useState<HomeTestimonio | null>(null);
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
      .get<HomeTestimonio[]>('http://localhost:3000/configuration/home-testimonios')
      .then(res => {
        setFormData(res.data[0]);
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
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'calificacion' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setMessage({ text: '', type: 'none' });

    try {
      await axios.put('http://localhost:3000/configuration/home-testimonios', formData);
      setMessage({ text: 'Testimonio actualizado exitosamente.', type: 'success' });
      setEditMode(false);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: 'none' }), 3000);
    } catch {
      setMessage({ text: 'Error al actualizar el testimonio.', type: 'error' });
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

  if (!formData) return null;

  return (
    <section className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Testimonio Principal</h2>
        <p className="text-gray-500 mt-1">Configure el testimonio destacado que se muestra en la página de inicio</p>
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

      <form onSubmit={handleSubmit} className="p-6">
        <div className={`rounded-lg border ${editMode ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-800">
              Detalles del Testimonio
            </h3>
            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:border-blue-500 transition-colors shadow-sm"
              >
                <Pencil size={18} />
                <span>Editar</span>
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Nombre del Cliente</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombreCliente"
                    value={formData.nombreCliente}
                    onChange={handleChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                    placeholder="Nombre del cliente"
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Cargo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                    placeholder="Cargo del cliente"
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Empresa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                    placeholder="Nombre de la empresa"
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Comentario</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MessageSquare size={18} className="text-gray-400 mt-1" />
                  </div>
                  <textarea
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg min-h-[120px] ${!editMode ? 'text-gray-600' : ''}`}
                    placeholder="Texto del testimonio"
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Calificación</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Star size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="calificacion"
                    value={formData.calificacion}
                    onChange={handleChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                    placeholder="Calificación (1-5)"
                    min={1}
                    max={5}
                    disabled={!editMode}
                    required
                  />
                </div>
                {formData.calificacion > 0 && (
                  <div className="mt-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < formData.calificacion ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {editMode && (
            <div className="flex mt-6 space-x-4">
              <button
                type="submit"
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
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default HomeTestimoniosForm;