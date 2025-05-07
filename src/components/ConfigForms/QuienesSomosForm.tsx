import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save, BookOpen, AlignLeft, Image, Loader2, Check, AlertCircle, X } from 'lucide-react';

interface QuienesSomosData {
  id: number;
  titulo: string;
  descripcion_1: string;
  descripcion_2?: string;
  imagen_url: string;
}

const QuienesSomosForm: React.FC = () => {
  const [formData, setFormData] = useState<QuienesSomosData>({
    id: 1,
    titulo: '',
    descripcion_1: '',
    descripcion_2: '',
    imagen_url: '',
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'none' }>({ 
    text: '', 
    type: 'none' 
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get<QuienesSomosData[]>('http://localhost:3000/configuration/quienes-somos')
      .then(response => {
        const data = response.data[0];
        if (data) {
          setFormData(data);
          setMessage({ text: '', type: 'none' });
        }
      })
      .catch(error => {
        console.error('Error al cargar los datos de Quienes Somos', error);
        setMessage({ text: 'Error al cargar los datos.', type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImagenFile(file);
      
      // Create preview URL for immediate feedback
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage({ text: '', type: 'none' });
    
    try {
      let imagenUrl = formData.imagen_url;
  
      if (imagenFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', imagenFile);
  
        const uploadRes = await axios.post('http://localhost:3000/upload-about-us', formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        if (uploadRes.data.filename) {
          imagenUrl = `/${uploadRes.data.filename}`;
        }
      }
  
      await axios.put('http://localhost:3000/configuration/quienes-somos', {
        ...formData,
        imagen_url: imagenUrl,
      });
  
      setMessage({ text: 'Sección "Quiénes somos" actualizada exitosamente.', type: 'success' });
      setEditMode(false);
      setPreviewImage(null);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: 'none' }), 3000);
    } catch (error) {
      console.error('Error al actualizar', error);
      setMessage({ text: 'Error al guardar los cambios.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes by fetching fresh data
    fetchData();
    setEditMode(false);
    setPreviewImage(null);
    setImagenFile(null);
  };
  
  const removeSelectedImage = () => {
    setImagenFile(null);
    setPreviewImage(null);
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

  return (
    <section className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Sección Quiénes Somos</h2>
        <p className="text-gray-500 mt-1">Configure la información sobre su empresa que aparece en la página "Quiénes Somos"</p>
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
              Información Corporativa
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Título</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Descripción Principal</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <AlignLeft size={18} className="text-gray-400 mt-1" />
                  </div>
                  <textarea
                    name="descripcion_1"
                    value={formData.descripcion_1}
                    onChange={handleInputChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg min-h-[120px] ${!editMode ? 'text-gray-600' : ''}`}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Descripción Adicional (Opcional)</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <AlignLeft size={18} className="text-gray-400 mt-1" />
                  </div>
                  <textarea
                    name="descripcion_2"
                    value={formData.descripcion_2 || ''}
                    onChange={handleInputChange}
                    className={`w-full pl-10 py-4 bg-white border ${
                      editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                    } rounded-md text-lg min-h-[120px] ${!editMode ? 'text-gray-600' : ''}`}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-700">Imagen</label>
                {editMode ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-center">
                      <Image size={36} className="text-gray-400 mb-3" />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-gray-500">Seleccione una imagen para la sección</p>
                      <p className="text-gray-400 text-sm">PNG, JPG o JPEG recomendado</p>
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!editMode}
                      className="hidden"
                      id="imagen-upload"
                    />
                    <label 
                      htmlFor="imagen-upload"
                      className="flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 cursor-pointer w-full"
                    >
                      Seleccionar archivo
                    </label>
                  </div>
                ) : null}

                {/* Preview current image */}
                {(formData.imagen_url || previewImage) && (
                  <div className="mt-4 border rounded-lg overflow-hidden bg-white p-2">
                    <div className="relative">
                      {editMode && (
                        <button 
                          onClick={removeSelectedImage} 
                          className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                          title="Quitar imagen"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <img
                        src={previewImage || `http://localhost:3000${formData.imagen_url}`}
                        alt="Previsualización"
                        className="max-h-80 w-full object-contain rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/600/400';
                          target.alt = 'Error cargando imagen';
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {previewImage ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editMode && (
            <div className="flex mt-6 space-x-4">
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

export default QuienesSomosForm;