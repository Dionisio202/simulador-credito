import React, { useState } from 'react';

interface TasaInversion {
  id: number;
  montoDesde: number;
  montoHasta: number;
  plazoDesde: number;
  plazoHasta: number;
  tasa: number;
}

const ConfigTasasInversion: React.FC = () => {
  const [tasas, setTasas] = useState<TasaInversion[]>([]);
  const [form, setForm] = useState<Partial<TasaInversion>>({});
  const [nextId, setNextId] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const limpiarFormulario = () => {
    setForm({});
    setEditId(null);
    setError("");
  };

  const validarRango = (tasa: Partial<TasaInversion>, excluirId?: number) => {
    if (
      tasa.montoDesde == null ||
      tasa.montoHasta == null ||
      tasa.plazoDesde == null ||
      tasa.plazoHasta == null ||
      tasa.tasa == null
    ) return "Todos los campos son requeridos";

    if (
      tasa.montoDesde < 0 || tasa.montoHasta < 0 ||
      tasa.plazoDesde < 0 || tasa.plazoHasta < 0 ||
      tasa.tasa < 0
    ) return "No se permiten valores negativos";

    if (tasa.montoDesde >= tasa.montoHasta)
      return "Monto desde debe ser menor que monto hasta";

    if (tasa.plazoDesde >= tasa.plazoHasta)
      return "Plazo desde debe ser menor que plazo hasta";

    const solapado = tasas.some(t =>
      t.id !== excluirId &&
      (
        (tasa.plazoDesde! <= t.plazoHasta && tasa.plazoHasta! >= t.plazoDesde) &&
        (tasa.montoDesde! <= t.montoHasta && tasa.montoHasta! >= t.montoDesde)
      )
    );

    if (solapado) return "El rango se solapa con otro existente";

    return null;
  };

  const handleAdd = () => {
    const validacion = validarRango(form);
    if (validacion) {
      setError(validacion);
      return;
    }

    setTasas([...tasas, { id: nextId, ...form } as TasaInversion]);
    setNextId(nextId + 1);
    limpiarFormulario();
  };

  const handleUpdate = () => {
    const validacion = validarRango(form, editId!);
    if (validacion) {
      setError(validacion);
      return;
    }

    setTasas(
      tasas.map(t => (t.id === editId ? { id: editId, ...form } as TasaInversion : t))
    );
    limpiarFormulario();
  };

  const startEdit = (tasa: TasaInversion) => {
    setForm(tasa);
    setEditId(tasa.id);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-32">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Configuración de Tasas por Rango</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Monto desde</label>
            <input
              type="number"
              value={form.montoDesde ?? ''}
              onChange={(e) => setForm({ ...form, montoDesde: parseFloat(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Monto hasta</label>
            <input
              type="number"
              value={form.montoHasta ?? ''}
              onChange={(e) => setForm({ ...form, montoHasta: parseFloat(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Plazo desde (días)</label>
            <input
              type="number"
              value={form.plazoDesde ?? ''}
              onChange={(e) => setForm({ ...form, plazoDesde: parseInt(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Plazo hasta (días)</label>
            <input
              type="number"
              value={form.plazoHasta ?? ''}
              onChange={(e) => setForm({ ...form, plazoHasta: parseInt(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tasa (%)</label>
            <input
              type="number"
              step="0.01"
              value={form.tasa ?? ''}
              onChange={(e) => setForm({ ...form, tasa: parseFloat(e.target.value) })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex items-end">
            {editId === null ? (
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 w-full"
              >
                Agregar
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 w-1/2"
                >
                  Guardar
                </button>
                <button
                  onClick={limpiarFormulario}
                  className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 w-1/2"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Monto Desde</th>
              <th className="px-4 py-2">Monto Hasta</th>
              <th className="px-4 py-2">Plazo Desde</th>
              <th className="px-4 py-2">Plazo Hasta</th>
              <th className="px-4 py-2">Tasa (%)</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasas.map((tasa) => (
              <tr key={tasa.id} className="border-t hover:bg-gray-50 text-center">
                <td className="px-4 py-2">${tasa.montoDesde}</td>
                <td className="px-4 py-2">${tasa.montoHasta}</td>
                <td className="px-4 py-2">{tasa.plazoDesde} días</td>
                <td className="px-4 py-2">{tasa.plazoHasta} días</td>
                <td className="px-4 py-2">{tasa.tasa}%</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => startEdit(tasa)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigTasasInversion;
