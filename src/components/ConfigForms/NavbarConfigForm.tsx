import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';

interface MenuItem {
  id: number;
  parent_id: number | null;
  label: string;
  path: string;
  category: string;
  orden: number;
}

const NavbarConfigForm: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editModeMap, setEditModeMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNavbarItems();
  }, []);

  const fetchNavbarItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get<MenuItem[]>('http://localhost:3000/configuration/navbar');
      setItems(res.data);
      const initialEditMap = Object.fromEntries(res.data.map(item => [item.id, false]));
      setEditModeMap(initialEditMap);
      setError(null);
    } catch (err) {
      setError('Error al cargar los ítems del navbar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id: number, field: keyof MenuItem, value: string | number | null) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleEdit = (id: number) => {
    setEditModeMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (item: MenuItem) => {
    try {
      await axios.put(`http://localhost:3000/configuration/navbar?id=${item.id}`, item);
      alert('Ítem actualizado correctamente');
      toggleEdit(item.id);
    } catch (err) {
      alert('Error al actualizar el ítem');
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Configuración del Navbar</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-7 gap-4 items-center">
              <input
                type="text"
                value={item.label ?? ''}
                onChange={e => handleChange(item.id, 'label', e.target.value)}
                placeholder="Label"
                className="col-span-1 border rounded px-3 py-2"
                disabled={!editModeMap[item.id]}
              />
              <input
                type="text"
                value={item.path ?? ''}
                onChange={e => handleChange(item.id, 'path', e.target.value)}
                placeholder="Path"
                className="col-span-2 border rounded px-3 py-2"
                disabled={!editModeMap[item.id]}
              />
              <input
                type="text"
                value={item.category ?? ''}
                onChange={e => handleChange(item.id, 'category', e.target.value)}
                placeholder="Categoría"
                className="col-span-1 border rounded px-3 py-2"
                disabled={!editModeMap[item.id]}
              />
              <input
                type="number"
                value={item.orden ?? ''}
                onChange={e => handleChange(item.id, 'orden', parseInt(e.target.value))}
                placeholder="Orden"
                className="col-span-1 border rounded px-3 py-2"
                disabled={!editModeMap[item.id]}
              />
              {!editModeMap[item.id] ? (
                <button
                  onClick={() => toggleEdit(item.id)}
                  className="col-span-1 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} className="mr-1" />
                  Editar
                </button>
              ) : (
                <button
                  onClick={() => handleSave(item)}
                  className="col-span-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NavbarConfigForm;
