import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

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
  const [message, setMessage] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    axios.get<Servicio[]>('http://localhost:3000/configuration/home-servicios')
      .then(res => setServicios(res.data))
      .catch(() => setMessage('Error al cargar los servicios.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: keyof Servicio, value: string) => {
    const updated = [...servicios];
    updated[index] = { ...updated[index], [field]: value };
    setServicios(updated);
  };

  const handleSave = (servicio: Servicio, index: number) => {
    axios.put('http://localhost:3000/configuration/home-servicios', servicio)
      .then(() => {
        setMessage('Servicio actualizado correctamente.');
        setEditIndex(null);
      })
      .catch(() => setMessage('Error al actualizar el servicio.'));
  };

  if (loading) return <p>Cargando servicios...</p>;

  return (
    <section className="bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Servicios (Home)</h2>
      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      {servicios.map((servicio, index) => {
        const isEditing = editIndex === index;

        return (
          <div key={servicio.id} className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">Servicio #{servicio.id}</h3>
              {!isEditing && (
                <button
                  onClick={() => setEditIndex(index)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                  <span>Editar</span>
                </button>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={servicio.titulo}
                onChange={(e) => handleChange(index, 'titulo', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={servicio.descripcion}
                onChange={(e) => handleChange(index, 'descripcion', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
              <input
                type="text"
                value={servicio.imagenUrl}
                onChange={(e) => handleChange(index, 'imagenUrl', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Link (opcional)</label>
              <input
                type="text"
                value={servicio.link || ''}
                onChange={(e) => handleChange(index, 'link', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button
                onClick={() => handleSave(servicio, index)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default HomeServiciosForm;
