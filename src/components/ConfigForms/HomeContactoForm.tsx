import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Save, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

interface HomeContacto {
  id: number;
  telefono: string;
  email: string;
  direccion: string;
}

const HomeContactoForm: React.FC = () => {
  const [form, setForm] = useState<HomeContacto>({ id: 1, telefono: '', email: '', direccion: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<HomeContacto>('http://localhost:3000/configuration/home-contacto');
      setForm(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos de contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setSaving(true);

    try {
      await axios.put('http://localhost:3000/configuration/home-contacto', form);
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span>Cargando información de contacto...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Información de Contacto</h2>
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
        <p className="text-gray-500 mt-1">Información mostrada en la página principal</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full pl-10 py-4 bg-white border ${
                    editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                  } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full pl-10 py-4 bg-white border ${
                    editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                  } rounded-md text-lg ${!editMode ? 'text-gray-600' : ''}`}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700">Dirección</label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <MapPin size={18} className="text-gray-400 mt-1" />
              </div>
              <textarea
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full pl-10 py-4 bg-white border ${
                  editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'
                } rounded-md text-lg h-full min-h-[120px] ${!editMode ? 'text-gray-600' : ''}`}
                required
              />
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-start pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`
                flex items-center space-x-2 px-6 py-4 rounded-md text-white font-medium text-lg
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
              onClick={() => {
                setEditMode(false);
                fetchData(); // Reset form to original data
              }}
              className="ml-4 flex items-center space-x-2 px-6 py-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              <span>Cancelar</span>
            </button>
          </div>
        )}

        <div className="h-8">
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
              Cambios guardados correctamente.
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default HomeContactoForm;