import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

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
  const [message, setMessage] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:3000/configuration/perspectivas-mercado')
      .then(res => {
        setData(res.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!data) return;
    const { name, value } = e.target;
    setData({ ...data, [name]: name === 'anio' ? Number(value) : value });
  };

  const handleSubmit = async () => {
    if (!data) return;
    try {
      await axios.put(`http://localhost:3000/configuration/perspectivas-mercado/${data.id}`, data);
      setMessage('Guardado exitosamente');
      setEditMode(false);
    } catch (err) {
      setMessage('Error al guardar');
    }
  };

  if (loading || !data) return <p className="text-center">Cargando...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Perspectiva del Mercado</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sección Tipo</label>
          <input
            type="text"
            name="seccionTipo"
            value={data.seccionTipo}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            type="number"
            name="anio"
            value={data.anio}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          name="titulo"
          value={data.titulo}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={data.descripcion}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border border-gray-300 p-2 rounded"
          rows={4}
          required
        />
      </div>

      {editMode && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      )}

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default PerspectivasMercadoForm;
