import React, { useEffect, useState } from "react";
import axios from "axios";

interface CreditType {
  id: number;
  name: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
}

interface AmountRange {
  max: number;
  value: number;
}

interface IndirectCharge {
  id: number;
  creditTypeId: number;
  name: string;
  chargeType: "percentage" | "fixed";
  amountRanges: AmountRange[];
}

const ConfigCreditos: React.FC = () => {
  const [creditTypes, setCreditTypes] = useState<CreditType[]>([]);
  const [indirectCharges, setIndirectCharges] = useState<IndirectCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"credits" | "charges">("credits");
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    type: "credit" | "charge";
    name: string;
  } | null>(null);

  const [newCreditType, setNewCreditType] = useState<Partial<CreditType>>({});
  const [newIndirectCharge, setNewIndirectCharge] = useState<
    Partial<IndirectCharge>
  >({});

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

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
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleCreateCreditType = async () => {
    const {
      name,
      interestRate,
      minAmount,
      maxAmount,
      minTermMonths,
      maxTermMonths,
    } = newCreditType;

    if (!name || name.trim().length < 3) {
      showToast("El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9]+$/.test(name.trim())) {
      showToast("El nombre contiene caracteres inválidos.", "error");
      return;
    }

    // ✅ Validación de duplicado
    const nameExists = creditTypes.some(
      (ct) => ct.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (nameExists) {
      showToast("Ya existe un tipo de crédito con ese nombre.", "error");
      return;
    }

    if (
      interestRate === undefined ||
      isNaN(interestRate) ||
      interestRate < 0 ||
      interestRate > 100
    ) {
      showToast("Ingrese una tasa de interés válida entre 0% y 100%.", "error");
      return;
    }

    if (
      minAmount === undefined ||
      isNaN(minAmount) ||
      minAmount <= 0 ||
      maxAmount === undefined ||
      isNaN(maxAmount) ||
      maxAmount < minAmount
    ) {
      showToast(
        "Verifique que el monto mínimo sea positivo y el máximo mayor.",
        "error"
      );
      return;
    }

    if (maxAmount - minAmount < 10) {
      showToast(
        "La diferencia entre montos mínimo y máximo es muy pequeña.",
        "error"
      );
      return;
    }

    if (
      minTermMonths === undefined ||
      isNaN(minTermMonths) ||
      minTermMonths < 0 ||
      maxTermMonths === undefined ||
      isNaN(maxTermMonths) ||
      maxTermMonths < minTermMonths
    ) {
      showToast(
        "Verifique los plazos en meses (mínimo menor o igual al máximo).",
        "error"
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/management/credit-types",
        newCreditType
      );
      fetchData();
      setNewCreditType({});
      setIsCreditModalOpen(false);
      showToast("Tipo de crédito creado exitosamente");
    } catch (error) {
      console.error("Error creating credit type", error);
      showToast("Error al crear tipo de crédito", "error");
    }
  };

  const handleCreateIndirectCharge = async () => {
    const { name, chargeType, amountRanges, creditTypeId } = newIndirectCharge;

    if (!name || name.trim() === "") {
      showToast("El nombre del cargo es obligatorio.", "error");
      return;
    }

    if (
      !chargeType ||
      (chargeType !== "percentage" && chargeType !== "fixed")
    ) {
      showToast(
        "Seleccione un tipo de cargo válido (Porcentaje o Fijo).",
        "error"
      );
      return;
    }

    if (!creditTypeId || isNaN(creditTypeId)) {
      showToast("Debe seleccionar un tipo de crédito asociado.", "error");
      return;
    }

    const existsDuplicate = indirectCharges.some(
      (c) =>
        c.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        c.creditTypeId === creditTypeId
    );

    if (existsDuplicate) {
      showToast(
        "Ya existe un cargo con ese nombre para el mismo tipo de crédito.",
        "error"
      );
      return;
    }

    if (!Array.isArray(amountRanges) || amountRanges.length === 0) {
      showToast("Debe agregar al menos un rango de monto.", "error");
      return;
    }

    for (let i = 0; i < amountRanges.length; i++) {
      const current = amountRanges[i];

      if (
        current.max === undefined ||
        current.value === undefined ||
        isNaN(current.max) ||
        isNaN(current.value)
      ) {
        showToast(
          `Los valores del rango ${i + 1} no pueden estar vacíos.`,
          "error"
        );
        return;
      }

      if (current.max <= 0 || current.value < 0) {
        showToast(
          `Los valores del rango ${i + 1} deben ser mayores o iguales a 0.`,
          "error"
        );
        return;
      }

      if (i > 0) {
        const prev = amountRanges[i - 1];

        if (current.max <= prev.max) {
          showToast(
            `El monto máximo del rango ${
              i + 1
            } debe ser mayor que el anterior.`,
            "error"
          );
          return;
        }

        if (current.value < prev.value) {
          showToast(
            `El valor del rango ${
              i + 1
            } no puede ser menor al del rango anterior.`,
            "error"
          );
          return;
        }
      }
    }

    try {
      await axios.post(
        "http://localhost:3000/management/indirect-charges",
        newIndirectCharge
      );
      fetchData();
      setNewIndirectCharge({});
      setIsChargeModalOpen(false);
      showToast("Cargo indirecto creado exitosamente");
    } catch (error) {
      console.error("Error creating indirect charge", error);
      showToast("Error al crear cargo indirecto", "error");
    }
  };

  const handleUpdateCreditType = async () => {
    const {
      id,
      name,
      interestRate,
      minAmount,
      maxAmount,
      minTermMonths,
      maxTermMonths,
    } = newCreditType;

    if (!id) return;

    if (!name || name.trim().length < 3) {
      showToast("El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9]+$/.test(name.trim())) {
      showToast("El nombre contiene caracteres inválidos.", "error");
      return;
    }

    const nameExists = creditTypes.some(
      (ct) =>
        ct.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        ct.id !== id
    );

    if (nameExists) {
      showToast("Ya existe otro tipo de crédito con ese nombre.", "error");
      return;
    }

    if (
      interestRate === undefined ||
      isNaN(interestRate) ||
      interestRate < 0 ||
      interestRate > 100
    ) {
      showToast("Ingrese una tasa de interés válida entre 0% y 100%.", "error");
      return;
    }

    if (
      minAmount === undefined ||
      isNaN(minAmount) ||
      minAmount <= 0 ||
      maxAmount === undefined ||
      isNaN(maxAmount) ||
      maxAmount < minAmount
    ) {
      showToast(
        "Verifique que el monto mínimo sea positivo y el máximo mayor.",
        "error"
      );
      return;
    }

    if (maxAmount - minAmount < 10) {
      showToast(
        "La diferencia entre montos mínimo y máximo es muy pequeña.",
        "error"
      );
      return;
    }

    if (
      minTermMonths === undefined ||
      isNaN(minTermMonths) ||
      minTermMonths < 0 ||
      maxTermMonths === undefined ||
      isNaN(maxTermMonths) ||
      maxTermMonths < minTermMonths
    ) {
      showToast(
        "Verifique los plazos en meses (mínimo menor o igual al máximo).",
        "error"
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/management/credit-types/${id}`,
        newCreditType
      );
      fetchData();
      setNewCreditType({});
      setIsCreditModalOpen(false);
      showToast("Tipo de crédito actualizado exitosamente");
    } catch (error) {
      console.error("Error updating credit type", error);
      showToast("Error al actualizar tipo de crédito", "error");
    }
  };

  const handleUpdateIndirectCharge = async () => {
    const { id, name, chargeType, amountRanges, creditTypeId } =
      newIndirectCharge;

    if (!id) return;

    if (!name || name.trim().length < 3) {
      showToast(
        "El nombre del cargo es obligatorio y debe tener al menos 3 caracteres.",
        "error"
      );
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9]+$/.test(name.trim())) {
      showToast("El nombre contiene caracteres inválidos.", "error");
      return;
    }

    if (
      !chargeType ||
      (chargeType !== "percentage" && chargeType !== "fixed")
    ) {
      showToast(
        "Seleccione un tipo de cargo válido (Porcentaje o Fijo).",
        "error"
      );
      return;
    }

    if (!creditTypeId || isNaN(creditTypeId)) {
      showToast("Debe seleccionar un tipo de crédito asociado.", "error");
      return;
    }

    const existsDuplicate = indirectCharges.some(
      (c) =>
        c.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        c.creditTypeId === creditTypeId &&
        c.id !== id
    );

    if (existsDuplicate) {
      showToast(
        "Ya existe otro cargo con ese nombre para el mismo tipo de crédito.",
        "error"
      );
      return;
    }

    if (!Array.isArray(amountRanges) || amountRanges.length === 0) {
      showToast("Debe agregar al menos un rango de monto.", "error");
      return;
    }

    for (let i = 0; i < amountRanges.length; i++) {
      const current = amountRanges[i];

      if (
        current.max === undefined ||
        current.value === undefined ||
        isNaN(current.max) ||
        isNaN(current.value)
      ) {
        showToast(
          `Los valores del rango ${i + 1} no pueden estar vacíos.`,
          "error"
        );
        return;
      }

      if (current.max <= 0 || current.value < 0) {
        showToast(
          `Los valores del rango ${i + 1} deben ser mayores o iguales a 0.`,
          "error"
        );
        return;
      }

      if (i > 0) {
        const prev = amountRanges[i - 1];

        if (current.max <= prev.max) {
          showToast(
            `El monto máximo del rango ${
              i + 1
            } debe ser mayor que el anterior.`,
            "error"
          );
          return;
        }

        if (current.value < prev.value) {
          showToast(
            `El valor del rango ${
              i + 1
            } no puede ser menor al del rango anterior.`,
            "error"
          );
          return;
        }
      }
    }

    try {
      await axios.put(
        `http://localhost:3000/management/indirect-charges/${id}`,
        newIndirectCharge
      );
      fetchData();
      setNewIndirectCharge({});
      setIsChargeModalOpen(false);
      showToast("Cargo indirecto actualizado exitosamente");
    } catch (error) {
      console.error("Error updating indirect charge", error);
      showToast("Error al actualizar cargo indirecto", "error");
    }
  };

  const getToastStyles = () => {
    switch (toastType) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
        return "bg-blue-600";
      default:
        return "bg-green-600";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-4 text-gray-700">Cargando configuración...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Configuración de Créditos
          </h1>
          <p className="text-gray-600 mt-2">
            Administre los tipos de crédito y cargos indirectos disponibles en
            el sistema
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-6">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab("credits")}
              className={`flex-1 py-3 rounded-md ${
                activeTab === "credits"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              Tipos de Crédito
            </button>
            <button
              onClick={() => setActiveTab("charges")}
              className={`flex-1 py-3 rounded-md ${
                activeTab === "charges"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              Cargos Indirectos
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tipos de Crédito */}
          <section
            className={`bg-white rounded-xl shadow-md overflow-hidden ${
              activeTab !== "credits" ? "hidden md:block" : ""
            }`}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tipos de Crédito
                </h2>
                <button
                  onClick={() => setIsCreditModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Nuevo Tipo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              {creditTypes.length === 0 ? (
                <div className="p-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">
                    No hay tipos de crédito configurados
                  </p>
                  <button
                    onClick={() => setIsCreditModalOpen(true)}
                    className="mt-4 text-blue-600 underline"
                  >
                    Agregar el primero
                  </button>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasa de Interés
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {creditTypes.map((ct) => (
                      <tr
                        key={ct.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {ct.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {ct.interestRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setNewCreditType(ct); // Carga los datos al modal
                              setIsCreditModalOpen(true);
                            }}
                            title="Ver Detalles"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 3C5.5 3 1.73 7.11 1 10c.73 2.89 4.5 7 9 7s8.27-4.11 9-7c-.73-2.89-4.5-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              setConfirmDelete({
                                id: ct.id,
                                type: "credit",
                                name: ct.name,
                              })
                            }
                            title="Eliminar"
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 3a1 1 0 00-.894.553L4 5H2a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-1.106-1.447A1 1 0 0014 3H6zm2 5a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Cargos Indirectos */}
          <section
            className={`bg-white rounded-xl shadow-md overflow-hidden ${
              activeTab !== "charges" ? "hidden md:block" : ""
            }`}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cargos Indirectos
                </h2>
                <button
                  onClick={() => {
                    setNewIndirectCharge({
                      name: "",
                      chargeType: "percentage",
                      amountRanges: [],
                      creditTypeId: 0,
                    });
                    setIsChargeModalOpen(true);
                  }}
                  // setIsChargeModalOpen(true)
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Nuevo Cargo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              {indirectCharges.length === 0 ? (
                <div className="p-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">
                    No hay cargos indirectos configurados
                  </p>
                  <button
                    onClick={() => setIsChargeModalOpen(true)}
                    className="mt-4 text-green-600 underline"
                  >
                    Agregar el primero
                  </button>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédito Asociado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {indirectCharges.map((ic) => (
                      <tr
                        key={ic.id}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {ic.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ic.chargeType === "percentage"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {ic.chargeType === "percentage"
                              ? "Porcentaje"
                              : "Fijo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {creditTypes.find((c) => c.id === ic.creditTypeId)
                            ?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              const freshCopy = JSON.parse(JSON.stringify(ic));
                              setNewIndirectCharge(freshCopy);
                              setIsChargeModalOpen(true);
                            }}
                            title="Ver Detalles"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 3C5.5 3 1.73 7.11 1 10c.73 2.89 4.5 7 9 7s8.27-4.11 9-7c-.73-2.89-4.5-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              setConfirmDelete({
                                id: ic.id,
                                type: "charge",
                                name: ic.name,
                              })
                            }
                            title="Eliminar"
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 3a1 1 0 00-.894.553L4 5H2a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-1.106-1.447A1 1 0 0014 3H6zm2 5a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal - Nuevo Tipo de Crédito */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Nuevo Tipo de Crédito
              </h2>
              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ej: Crédito Hipotecario"
                  value={newCreditType.name || ""}
                  onChange={(e) =>
                    setNewCreditType({ ...newCreditType, name: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tasa de Interés (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 12.5"
                  value={newCreditType.interestRate || ""}
                  onChange={(e) =>
                    setNewCreditType({
                      ...newCreditType,
                      interestRate: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Mínimo
                </label>
                <input
                  type="number"
                  value={newCreditType.minAmount || ""}
                  onChange={(e) =>
                    setNewCreditType({
                      ...newCreditType,
                      minAmount: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Máximo
                </label>
                <input
                  type="number"
                  value={newCreditType.maxAmount || ""}
                  onChange={(e) =>
                    setNewCreditType({
                      ...newCreditType,
                      maxAmount: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo Mínimo (meses)
                </label>
                <input
                  type="number"
                  value={newCreditType.minTermMonths || ""}
                  onChange={(e) =>
                    setNewCreditType({
                      ...newCreditType,
                      minTermMonths: parseInt(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo Máximo (meses)
                </label>
                <input
                  type="number"
                  value={newCreditType.maxTermMonths || ""}
                  onChange={(e) =>
                    setNewCreditType({
                      ...newCreditType,
                      maxTermMonths: parseInt(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="col-span-2 flex space-x-3 mt-4">
                <button
                  onClick={() => setIsCreditModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newCreditType.id) {
                      handleUpdateCreditType();
                    } else {
                      handleCreateCreditType();
                    }
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Nuevo Cargo Indirecto */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Nuevo Cargo Indirecto
              </h2>
              <button
                onClick={() => setIsChargeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Nombre */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ej: Seguro de vida"
                  value={newIndirectCharge.name || ""}
                  onChange={(e) =>
                    setNewIndirectCharge({
                      ...newIndirectCharge,
                      name: e.target.value,
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              {/* Tipo de cargo */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cargo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-lg transition-all ${
                      newIndirectCharge.chargeType === "percentage"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-300"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setNewIndirectCharge({
                        ...newIndirectCharge,
                        chargeType: "percentage",
                      })
                    }
                  >
                    Porcentaje
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-lg transition-all ${
                      newIndirectCharge.chargeType === "fixed"
                        ? "bg-orange-100 text-orange-800 border-2 border-orange-300"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setNewIndirectCharge({
                        ...newIndirectCharge,
                        chargeType: "fixed",
                      })
                    }
                  >
                    Fijo
                  </button>
                </div>
              </div>

              {/* Rangos */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rangos por monto
                </label>
                {(newIndirectCharge.amountRanges || []).map((range, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Monto máximo"
                      className="w-1/2 border px-3 py-2 rounded"
                      value={!isNaN(range.max) ? range.max : ""}
                      onChange={(e) => {
                        const updated = [
                          ...(newIndirectCharge.amountRanges || []),
                        ];
                        updated[idx].max = parseFloat(e.target.value);
                        setNewIndirectCharge({
                          ...newIndirectCharge,
                          amountRanges: updated,
                        });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      className="w-1/2 border px-3 py-2 rounded"
                      value={!isNaN(range.value) ? range.value : ""}
                      onChange={(e) => {
                        const updated = [
                          ...(newIndirectCharge.amountRanges || []),
                        ];
                        updated[idx].value = parseFloat(e.target.value);
                        setNewIndirectCharge({
                          ...newIndirectCharge,
                          amountRanges: updated,
                        });
                      }}
                    />

                    <button
                      className="text-red-500 font-bold"
                      onClick={() => {
                        const updated = [
                          ...(newIndirectCharge.amountRanges || []),
                        ];
                        updated.splice(idx, 1);
                        setNewIndirectCharge({
                          ...newIndirectCharge,
                          amountRanges: updated,
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="text-green-600 text-sm mt-1 hover:underline"
                  onClick={() =>
                    setNewIndirectCharge({
                      ...newIndirectCharge,
                      amountRanges: [
                        ...(newIndirectCharge.amountRanges || []),
                        { max: NaN, value: NaN },
                      ],
                    })
                  }
                >
                  + Agregar Rango
                </button>
              </div>
              {newIndirectCharge.amountRanges &&
                newIndirectCharge.amountRanges.length > 0 && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm rounded-md px-4 py-2 mb-4">
                    Si no cubres todos los rangos posibles, se tomará el último
                    rango como <strong>“en adelante”</strong> automáticamente.
                  </div>
                )}
              {/* Tipo de crédito asociado */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Crédito Asociado
                </label>
                <select
                  value={newIndirectCharge.creditTypeId || ""}
                  onChange={(e) =>
                    setNewIndirectCharge({
                      ...newIndirectCharge,
                      creditTypeId: parseInt(e.target.value),
                    })
                  }
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Seleccione un tipo de crédito</option>
                  {creditTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsChargeModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newIndirectCharge.id) {
                      handleUpdateIndirectCharge();
                    } else {
                      handleCreateIndirectCharge();
                    }
                  }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${getToastStyles()} animate-fadeIn flex items-center`}
        >
          <span className="mr-2">
            {toastType === "success" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toastType === "error" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toastType === "info" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          {toastMessage}
        </div>
      )}

      {/* CSS Animation Classes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ¿Desea eliminar{" "}
              {confirmDelete.type === "credit"
                ? "el tipo de crédito"
                : "el cargo indirecto"}{" "}
              "{confirmDelete.name}"?
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. Puede fallar si está siendo
              utilizado.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  try {
                    if (confirmDelete.type === "credit") {
                      await axios.delete(
                        `http://localhost:3000/management/credit-types/${confirmDelete.id}`
                      );
                    } else {
                      await axios.delete(
                        `http://localhost:3000/management/indirect-charges/${confirmDelete.id}`
                      );
                    }
                    showToast("Eliminado exitosamente", "success");
                    fetchData();
                  } catch (error: any) {
                    const code = error?.response?.data?.code;
                    if (code === "FOREIGN_KEY_CONSTRAINT") {
                      showToast(
                        "No se puede eliminar porque está en uso.",
                        "error"
                      );
                    } else {
                      showToast("Error al eliminar", "error");
                    }
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigCreditos;