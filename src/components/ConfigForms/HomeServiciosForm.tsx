import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save, Image, File, Link2, AlignLeft, Loader2, Check, AlertCircle } from 'lucide-react';

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  link?: string;
}

const HomeServiciosForm: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'none' }>({ 
    text: '', 
    type: 'none' 
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Servicio[]>('http://localhost:3000/configuration/home-servicios');
      setServicios(res.data);
      setMessage({ text: '', type: 'none' });
    } catch (err) {
      setMessage({ text: 'Error al cargar los servicios.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof Servicio, value: string) => {
    const updated = [...servicios];
    updated[index] = { ...updated[index], [field]: value };
    setServicios(updated);
  };

  const handleSave = async (servicio: Servicio, index: number) => {
    setSaving(true);
    try {
      await axios.put('http://localhost:3000/configuration/home-servicios', servicio);
      setMessage({ text: 'Servicio actualizado correctamente.', type: 'success' });
      setEditIndex(null);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: 'none' }), 3000);
    } catch (err) {
      setMessage({ text: 'Error al actualizar el servicio.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleImagePreview = (id: number) => {
    setPreviewUrls(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCancel = (index: number) => {
    // Revert changes by fetching fresh data
    fetchData();
    setEditIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span>Cargando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Servicios en la Página Principal</h2>
        <p className="text-gray-500 mt-1">Configure los servicios que se muestran en la página de inicio</p>
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

      <div className="p-6 space-y-8">
        {servicios.map((servicio, index) => {
          const isEditing = editIndex === index;

          return (
            <div 
              key={servicio.id} 
              className={`rounded-lg border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} p-6`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-800">
                  Servicio #{servicio.id}
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setEditIndex(index)}
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
                    <label className="block text-lg font-medium mb-2 text-gray-700">Título</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <File size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={servicio.titulo}
                        onChange={(e) => handleChange(index, 'titulo', e.target.value)}
                        className={`w-full pl-10 py-4 bg-white border ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                        } rounded-md text-lg ${!isEditing ? 'text-gray-600' : ''}`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Descripción</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <AlignLeft size={18} className="text-gray-400 mt-1" />
                      </div>
                      <textarea
                        value={servicio.descripcion}
                        onChange={(e) => handleChange(index, 'descripcion', e.target.value)}
                        className={`w-full pl-10 py-4 bg-white border ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                        } rounded-md text-lg min-h-[120px] ${!isEditing ? 'text-gray-600' : ''}`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Imagen (URL)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={servicio.imagenUrl}
                        onChange={(e) => handleChange(index, 'imagenUrl', e.target.value)}
                        className={`w-full pl-10 py-4 bg-white border ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                        } rounded-md text-lg ${!isEditing ? 'text-gray-600' : ''}`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    
                    {servicio.imagenUrl && (
                      <div className="mt-2">
                        <button 
                          onClick={() => toggleImagePreview(servicio.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {previewUrls[servicio.id] ? 'Ocultar vista previa' : 'Ver vista previa'}
                        </button>
                        
                        {previewUrls[servicio.id] && (
                          <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                            <img 
                              src={servicio.imagenUrl} 
                              alt={servicio.titulo}
                              className="max-h-40 object-contain mx-auto" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/api/placeholder/200/150';
                                target.alt = 'Error cargando imagen';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Link (opcional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link2 size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={servicio.link || ''}
                        onChange={(e) => handleChange(index, 'link', e.target.value)}
                        placeholder="https://..."
                        className={`w-full pl-10 py-4 bg-white border ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                        } rounded-md text-lg ${!isEditing ? 'text-gray-600' : ''}`}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex mt-6 space-x-4">
                  <button
                    onClick={() => handleSave(servicio, index)}
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
                    onClick={() => handleCancel(index)}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeServiciosForm;