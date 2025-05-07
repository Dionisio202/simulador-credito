import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

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
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    axios.get<QuienesSomosData[]>('http://localhost:3000/configuration/quienes-somos')
      .then(response => {
        const data = response.data[0];
        if (data) setFormData(data);
      })
      .catch(error => console.error('Error al cargar los datos de Quienes Somos', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
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
  
      // Ahora sí: usas la nueva imagenUrl correctamente
      await axios.put('http://localhost:3000/configuration/quienes-somos', {
        ...formData,
        imagen_url: imagenUrl,
      });
  
      alert('Sección "Quiénes somos" actualizada exitosamente');
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar', error);
      alert('Error al guardar los cambios');
    }
  };
  

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sección Quiénes Somos</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} className="mr-1" />
            Editar
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción 1</label>
          <textarea
            name="descripcion_1"
            value={formData.descripcion_1}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción 2</label>
          <textarea
            name="descripcion_2"
            value={formData.descripcion_2 || ''}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!editMode}
          />
          {formData.imagen_url && (
            <img
              src={"http://localhost:3000"+formData.imagen_url}
              alt="Previsualización"
              className="mt-2 h-32 object-contain rounded"
            />
          )}
        </div>

        {editMode && (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        )}
      </div>
    </div>
  );
};

export default QuienesSomosForm;