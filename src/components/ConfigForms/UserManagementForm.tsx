import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  nombre: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserManagementForm: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    id: null as number | null,
    name: '',
    password: '',
    email: '',
    roleId: '',
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get<Role[]>('http://localhost:3000/user-management/roles');
      setRoles(res.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      showNotification('Error al cargar los roles', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>('http://localhost:3000/user-management');
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      showNotification('Error al cargar los usuarios', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (user: User) => {
    const matchingRole = roles.find(r => r.nombre === user.role);
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      roleId: matchingRole ? String(matchingRole.id) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', password: '', email: '', roleId: '' });
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await axios.delete(`http://localhost:3000/user-management/${deleteId}`);
      fetchUsers();
      setShowModal(false);
      showNotification('Usuario eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showNotification('No se pudo eliminar el usuario', 'error');
    }
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.roleId) {
      showNotification('Todos los campos son obligatorios (excepto contraseña para editar)', 'error');
      return;
    }

    setLoading(true);

    try {
      if (form.id) {
        // EDITAR USUARIO
        await axios.put(`http://localhost:3000/user-management/${form.id}`, {
          username: form.name,
          email: form.email,
          password: form.password,
          roleId: form.roleId,
        });

        if (form.password.trim() !== '') {
          await axios.post('http://localhost:3000/email/send-password', {
            email: form.email,
            password: form.password,
          });
        }
        showNotification('Usuario actualizado correctamente', 'success');
      } else {
        // CREAR USUARIO
        if (!form.password) {
          showNotification('La contraseña es obligatoria para crear un usuario', 'error');
          setLoading(false);
          return;
        }

        await axios.post('http://localhost:3000/users/register', form);

        await axios.post('http://localhost:3000/email/send-password', {
          email: form.email,
          password: form.password,
        });
        showNotification('Usuario creado correctamente', 'success');
      }

      fetchUsers();
      setForm({ id: null, name: '', password: '', email: '', roleId: '' });
    } catch (error) {
      console.error('Error al guardar usuario', error);
      showNotification('Error al guardar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 
          'bg-red-100 border-l-4 border-red-500 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-500 mb-6">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Form card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              {form.id ? 'Editar usuario' : 'Crear nuevo usuario'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                <input
                  name="name"
                  placeholder="Ingrese nombre de usuario"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Ingrese correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {!form.id && <span className="text-red-500">*</span>}
                </label>
                <input
                  name="password"
                  placeholder={form.id ? "Dejar en blanco para mantener la actual" : "Ingrese contraseña"}
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {form.id && (
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-5 py-2 rounded-md text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  form.id ? 'Actualizar usuario' : 'Crear usuario'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Users table card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Usuarios existentes</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-sm text-amber-50"
              />
              <svg 
                className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'Supervisor' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron usuarios con ese término de búsqueda' : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
            Total: {filteredUsers.length} usuarios
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementForm;