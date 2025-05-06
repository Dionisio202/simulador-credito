import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<HomeTestimonio[]>('http://localhost:3000/configuration/home-testimonios')
      .then(res => setFormData(res.data[0]))
      .catch(() => setMessage('Error al cargar los datos.'));
  }, []);

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

    setLoading(true);
    setMessage('');

    try {
      await axios.put('http://localhost:3000/configuration/home-testimonios', formData);
      setMessage('Testimonio actualizado exitosamente.');
      setEditMode(false);
    } catch {
      setMessage('Error al actualizar el testimonio.');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p>Cargando datos...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Testimonio Principal</h2>
        {!editMode && (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 space-x-1"
          >
            <Pencil size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      <input
        type="text"
        name="nombreCliente"
        value={formData.nombreCliente}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Nombre del cliente"
        disabled={!editMode}
        required
      />

      <input
        type="text"
        name="cargo"
        value={formData.cargo}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Cargo"
        disabled={!editMode}
        required
      />

      <input
        type="text"
        name="empresa"
        value={formData.empresa}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Empresa"
        disabled={!editMode}
        required
      />

      <textarea
        name="comentario"
        value={formData.comentario}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Comentario"
        rows={4}
        disabled={!editMode}
        required
      />

      <input
        type="number"
        name="calificacion"
        value={formData.calificacion}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Calificación (1-5)"
        min={1}
        max={5}
        disabled={!editMode}
        required
      />

      {editMode && (
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      )}

      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </form>
  );
};

export default HomeTestimoniosForm;
