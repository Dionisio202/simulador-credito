import React, { useEffect, useState } from "react";
import axios from "axios";

interface CreditType {
  id: number;
  name: string;
  interestRate: number;
}

interface IndirectCharge {
  id: number;
  creditTypeId: number;
  name: string;
  chargeType: "percentage" | "fixed";
  value: number;
}

const ConfigCreditos: React.FC = () => {
  const [creditTypes, setCreditTypes] = useState<CreditType[]>([]);
  const [indirectCharges, setIndirectCharges] = useState<IndirectCharge[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCreditType, setNewCreditType] = useState<Partial<CreditType>>({});
  const [newIndirectCharge, setNewIndirectCharge] = useState<Partial<IndirectCharge>>({});

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [creditsRes, chargesRes] = await Promise.all([
        axios.get("http://localhost:3000/management/credit-types"),
        axios.get("http://localhost:3000/management/indirect-charges"),
      ]);
      setCreditTypes(creditsRes.data);
      setIndirectCharges(chargesRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleCreateCreditType = async () => {
    try {
      await axios.post("http://localhost:3000/management/credit-types", newCreditType);
      fetchData();
      setNewCreditType({});
      setIsCreditModalOpen(false);
      showToast("Tipo de crédito creado exitosamente");
    } catch (error) {
      console.error("Error creating credit type", error);
    }
  };

  const handleCreateIndirectCharge = async () => {
    try {
      await axios.post("http://localhost:3000/management/indirect-charges", newIndirectCharge);
      fetchData();
      setNewIndirectCharge({});
      setIsChargeModalOpen(false);
      showToast("Cargo indirecto creado exitosamente");
    } catch (error) {
      console.error("Error creating indirect charge", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-32 relative">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Tipos de Crédito */}
        <section className="bg-white p-6 rounded-lg shadow-md h-[500px] overflow-y-auto w-full lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tipos de Crédito</h2>
            <button
              onClick={() => setIsCreditModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Nuevo Tipo de Crédito
            </button>
          </div>

          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Tasa de Interés</th>
              </tr>
            </thead>
            <tbody>
              {creditTypes.map((ct) => (
                <tr key={ct.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{ct.name}</td>
                  <td className="px-4 py-2">{ct.interestRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cargos Indirectos */}
        <section className="bg-white p-6 rounded-lg shadow-md h-[500px] overflow-y-auto w-full lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Cargos Indirectos</h2>
            <button
              onClick={() => setIsChargeModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Nuevo Cargo Indirecto
            </button>
          </div>

          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Tipo de Cargo</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Tipo de Crédito Asociado</th>
              </tr>
            </thead>
            <tbody>
              {indirectCharges.map((ic) => (
                <tr key={ic.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{ic.name}</td>
                  <td className="px-4 py-2">{ic.chargeType}</td>
                  <td className="px-4 py-2">${ic.value}</td>
                  <td className="px-4 py-2">{creditTypes.find(c => c.id === ic.creditTypeId)?.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Modal - Nuevo Tipo de Crédito */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Nuevo Tipo de Crédito</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newCreditType.name || ""}
              onChange={(e) => setNewCreditType({ ...newCreditType, name: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="number"
              placeholder="Tasa de Interés (%)"
              value={newCreditType.interestRate || ""}
              onChange={(e) => setNewCreditType({ ...newCreditType, interestRate: parseFloat(e.target.value) })}
              className="border p-2 rounded w-full mb-6"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsCreditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={handleCreateCreditType} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Nuevo Cargo Indirecto */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Nuevo Cargo Indirecto</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newIndirectCharge.name || ""}
              onChange={(e) => setNewIndirectCharge({ ...newIndirectCharge, name: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <select
              value={newIndirectCharge.chargeType || ""}
              onChange={(e) => setNewIndirectCharge({ ...newIndirectCharge, chargeType: e.target.value as "percentage" | "fixed" })}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">Seleccione Tipo de Cargo</option>
              <option value="percentage">Porcentaje</option>
              <option value="fixed">Fijo</option>
            </select>
            <input
              type="number"
              placeholder="Valor ($)"
              value={newIndirectCharge.value || ""}
              onChange={(e) => setNewIndirectCharge({ ...newIndirectCharge, value: parseFloat(e.target.value) })}
              className="border p-2 rounded w-full mb-4"
            />
            <select
              value={newIndirectCharge.creditTypeId || ""}
              onChange={(e) => setNewIndirectCharge({ ...newIndirectCharge, creditTypeId: parseInt(e.target.value) })}
              className="border p-2 rounded w-full mb-6"
            >
              <option value="">Seleccione Tipo de Crédito</option>
              {creditTypes.map(ct => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsChargeModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={handleCreateIndirectCharge} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ConfigCreditos;
