import React, { useEffect, useState } from 'react';
import { Pencil, Save, X, Upload, AlertCircle } from 'lucide-react';

interface HomeBanner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagenUrl: string;
}

const HomeBannerForm = () => {
  const [banner, setBanner] = useState<HomeBanner>({
    id: 0,
    titulo: '',
    subtitulo: '',
    imagenUrl: '',
  });

  const [preview, setPreview] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/configuration/home-banner');
        if (!res.ok) throw new Error('Error al cargar datos');

        const data = await res.json();
        const item = data[0];
        setBanner(item);
        setPreview(`http://localhost:3000${item.imagenUrl}`);
        setError('');
      } catch (err) {
        console.error('Error al cargar banner', err);
        setError('No se pudo cargar la información del banner');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const imageUrl = `/public/${selectedFile.name}`;
    setFile(selectedFile);
    setBanner({ ...banner, imagenUrl: imageUrl });
    setPreview(`http://localhost:5173${imageUrl}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('http://localhost:3000/configuration/home-banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(banner),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      setEditMode(false);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Error al actualizar banner');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    fetch('http://localhost:3000/configuration/home-banner')
      .then(res => res.json())
      .then(data => {
        const item = data[0];
        setBanner(item);
        setPreview(`http://localhost:3000${item.imagenUrl}`);
        setFile(null);
        setEditMode(false);
      });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Banner Principal</h2>
          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm hover:bg-blue-50 border border-blue-200 transition-all"
            >
              <Pencil size={16} className="mr-2" /> Editar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md shadow-sm hover:bg-gray-50 border border-gray-200 transition-all"
              >
                <X size={16} className="mr-2" /> Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 border-l-4 border-red-500 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                name="titulo"
                value={banner.titulo}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full rounded-md border ${!editMode ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} px-4 py-2 shadow-sm transition-all`}
                placeholder="Ingrese el título del banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <textarea
                name="subtitulo"
                value={banner.subtitulo}
                onChange={handleChange}
                disabled={!editMode}
                rows={4}
                className={`w-full rounded-md border ${!editMode ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} px-4 py-2 shadow-sm transition-all`}
                placeholder="Ingrese el subtítulo o descripción"
              />
            </div>

            {editMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actualizar imagen</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Haga clic para seleccionar</span> o arrastre una imagen
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG o WEBP (Máx. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Vista previa</label>
              <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                {preview ? (
                  <img
                    src={preview}
                    alt="Vista previa del banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 w-full text-gray-500">
                    <Upload size={24} />
                    <p className="mt-2">No hay imagen seleccionada</p>
                  </div>
                )}
              </div>
              {preview && (
                <p className="mt-2 text-xs text-gray-500 truncate">
                  {banner.imagenUrl.split('/').pop()}
                </p>
              )}
            </div>
          </div>
        </div>

        {editMode && (
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={`flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-md shadow-sm text-white ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {saving ? (
                <>
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBannerForm;
