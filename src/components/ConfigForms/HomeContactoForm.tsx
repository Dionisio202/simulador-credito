import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

interface HomeContacto {
  id: number;
  telefono: string;
  email: string;
  direccion: string;
}

const HomeContactoForm: React.FC = () => {
  const [form, setForm] = useState<HomeContacto>({ id: 1, telefono: '', email: '', direccion: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    axios.get<HomeContacto>('http://localhost:3000/configuration/home-contacto')
      .then(res => setForm(res.data))
      .catch(() => setError('Error al cargar los datos'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      await axios.put('http://localhost:3000/configuration/home-contacto', form);
      setSuccess(true);
      setEditMode(false);
    } catch {
      setError('Error al guardar los cambios');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Contacto en la Página Principal</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          {editMode && (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          )}

          {success && <p className="text-green-600 mt-2">Cambios guardados correctamente.</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default HomeContactoForm;
