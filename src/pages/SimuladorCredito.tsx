import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CreditType {
  id: number;
  name: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
}

interface IndirectCharge {
  id: number;
  creditTypeId: number;
  name: string;
  chargeType: string;
  value: number;
}

interface AmortizationRow {
  N: string | number;
  "Cuota Simple": string;
  "Cuota Compuesta": string;
  Interes: string;
  Capital: string;
  Saldo: string;
}

const SimuladorCredito: React.FC = () => {
  const [creditTypes, setCreditTypes] = useState<CreditType[]>([]);
  const [indirectCharges, setIndirectCharges] = useState<IndirectCharge[]>([]);
  const [selectedCreditType, setSelectedCreditType] =
    useState<CreditType | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [termMonths, setTermMonths] = useState<string>("");
  const [systemType, setSystemType] = useState<"french" | "german">("french");
  const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAmortizationTable, setShowAmortizationTable] =
    useState<boolean>(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = 
    useState<boolean>(false);
  const [errors, setErrors] = useState<{amount?: string; termMonths?: string}>({});
  
  // Add simulation result states
  const [simulationResults, setSimulationResults] = useState({
    totalInterest: 0,
    additionalCharges: 0,
    totalPayment: 0,
    hasSimulated: false
  });

  useEffect(() => {
    fetch("http://localhost:3000/management/credit-types")
      .then((res) => res.json())
      .then(setCreditTypes);

    fetch("http://localhost:3000/management/indirect-charges")
      .then((res) => res.json())
      .then(setIndirectCharges);
  }, []);

  const formatCurrency = (value: number | string) => {
    if (typeof value === "string") value = parseFloat(value);
    return `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  };

  // Calculate individual charge value
  const calculateChargeValue = (charge: IndirectCharge, currentAmount: number) => {
    return charge.chargeType === "porcentaje"
      ? currentAmount * (charge.value / 100)
      : charge.value;
  };

  const handleSimulate = async () => {
    if (!selectedCreditType) return;
    
    // Validate inputs first
    const newErrors: {amount?: string; termMonths?: string} = {};
    const amountValue = amount === "" ? 0 : Number(amount);
    const termValue = termMonths === "" ? 0 : Number(termMonths);
    
    // Check for empty values
    if (amount === "") {
      newErrors.amount = "El monto es requerido";
    }
    
    if (termMonths === "") {
      newErrors.termMonths = "El plazo es requerido";
    }
    
    // Check for range violations
    if (amount !== "" && selectedCreditType) {
      if (amountValue < selectedCreditType.minAmount) {
        newErrors.amount = `El monto mínimo es ${formatCurrency(selectedCreditType.minAmount)}`;
      } else if (amountValue > selectedCreditType.maxAmount) {
        newErrors.amount = `El monto máximo es ${formatCurrency(selectedCreditType.maxAmount)}`;
      }
    }
    
    if (termMonths !== "" && selectedCreditType) {
      if (termValue < selectedCreditType.minTermMonths) {
        newErrors.termMonths = `El plazo mínimo es ${selectedCreditType.minTermMonths} meses`;
      } else if (termValue > selectedCreditType.maxTermMonths) {
        newErrors.termMonths = `El plazo máximo es ${selectedCreditType.maxTermMonths} meses`;
      }
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // If there are errors, don't proceed with simulation
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Calculate results with validated values
      const filteredCharges = indirectCharges.filter(
        (c) => c.creditTypeId === selectedCreditType.id
      );
      
      const additionalCharges = filteredCharges.reduce((sum, charge) => {
        return sum + calculateChargeValue(charge, amountValue);
      }, 0);
      
      const interestRate = selectedCreditType.interestRate || 0;
      const totalInterest = amountValue * (interestRate / 100) * (termValue / 12);
      const totalPayment = amountValue + totalInterest + additionalCharges;
      
      // Update simulation results
      setSimulationResults({
        totalInterest,
        additionalCharges,
        totalPayment,
        hasSimulated: true
      });
      
      // Fetch amortization data
      const response = await fetch(
        "http://localhost:3000/simulate/amortization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountValue,
            termMonths: termValue,
            creditType: selectedCreditType.id,
            systemType,
          }),
        }
      );
      const data = await response.json();
      setAmortizationData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers or empty string
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      
      // Clear error when user starts typing
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers or empty string
    if (value === "" || /^\d+$/.test(value)) {
      setTermMonths(value);
      
      // Clear error when user starts typing
      if (errors.termMonths) {
        setErrors(prev => ({ ...prev, termMonths: undefined }));
      }
    }
  };

  const handleCreditTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ct = creditTypes.find((c) => c.id === Number(e.target.value));
    setSelectedCreditType(ct || null);
    if (ct) {
      setTermMonths("");
      setAmount("");
    }
    
    // Reset simulation results when changing credit type
    setSimulationResults({
      totalInterest: 0,
      additionalCharges: 0,
      totalPayment: 0,
      hasSimulated: false
    });
    setAmortizationData([]);
    setShowAmortizationTable(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-18 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda: Formulario */}
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-medium mb-2">
                Tipo de Crédito
              </label>
              <div className="relative">
                <select
                  value={selectedCreditType?.id || ""}
                  onChange={handleCreditTypeChange}
                  className="w-full bg-white border border-gray-300 rounded p-4 text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Seleccione un tipo
                  </option>
                  {creditTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name} - {ct.interestRate}%
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronDown size={20} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Monto del crédito
              </label>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={!selectedCreditType}
                  className={`w-full bg-white border ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  } rounded p-4 text-lg focus:outline-none focus:ring-2 ${
                    errors.amount ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                  placeholder="Ingrese monto"
                />
                {errors.amount ? (
                  <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
                ) : (
                  selectedCreditType && (
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        Min: {formatCurrency(selectedCreditType.minAmount)}
                      </span>
                      <span>
                        Max: {formatCurrency(selectedCreditType.maxAmount)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Meses a pagar
              </label>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={termMonths}
                  onChange={handleTermChange}
                  disabled={!selectedCreditType}
                  className={`w-full bg-white border ${
                    errors.termMonths ? "border-red-500" : "border-gray-300"
                  } rounded p-4 text-lg focus:outline-none focus:ring-2 ${
                    errors.termMonths ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                  placeholder="Ingrese plazo"
                />
                {errors.termMonths ? (
                  <div className="text-red-500 text-sm mt-1">{errors.termMonths}</div>
                ) : (
                  selectedCreditType && (
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Min: {selectedCreditType.minTermMonths} meses</span>
                      <span>Max: {selectedCreditType.maxTermMonths} meses</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Tipo de amortizacion
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded cursor-pointer transition ${
                    systemType === "french"
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSystemType("french")}
                >
                  <h3 className="font-medium text-lg mb-1">Método Francés</h3>
                  <p className="text-sm text-gray-600">
                    Cuotas se mantienen fijas en el tiempo
                  </p>
                </div>
                <div
                  className={`p-4 border rounded cursor-pointer transition ${
                    systemType === "german"
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSystemType("german")}
                >
                  <h3 className="font-medium text-lg mb-1">Método Alemán</h3>
                  <p className="text-sm text-gray-600">
                    Cuotas variables que decrecen en el tiempo
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isLoading || !selectedCreditType}
              className={`
                w-full py-4 rounded text-white font-medium text-lg
                ${
                  isLoading || !selectedCreditType
                    ? "bg-blue-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                transition shadow
              `}
            >
              {isLoading ? "Calculando..." : "Simular"}
            </button>
          </div>

          {/* Columna derecha: Resultados */}
          <div className="space-y-8">
            {selectedCreditType && (
              <>
                <div className="bg-white border border-gray-200 p-6 rounded">
                  <h3 className="text-lg font-medium mb-4">
                    Detalle de tu crédito
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Capital:</span>
                                              <span className="font-medium text-gray-800">
                        {simulationResults.hasSimulated ? formatCurrency(Number(amount)) : formatCurrency(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de interés:</span>
                      <span className="font-medium text-gray-800">
                        {formatCurrency(simulationResults.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span>Cargos adicionales:</span>
                        {simulationResults.hasSimulated && indirectCharges.filter(c => c.creditTypeId === selectedCreditType.id).length > 0 && (
                          <button 
                            onClick={() => setShowAdditionalCharges(!showAdditionalCharges)}
                            className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            {showAdditionalCharges ? "Ocultar desglose" : "Ver desglose"}
                          </button>
                        )}
                      </div>
                      <span className="font-medium text-gray-800">
                        {formatCurrency(simulationResults.additionalCharges)}
                      </span>
                    </div>

                    {/* Lista de cargos adicionales */}
                    {showAdditionalCharges && simulationResults.hasSimulated && (
                      <div className="pl-4 pr-2 py-2 bg-gray-50 rounded-md">
                        {indirectCharges
                          .filter(c => c.creditTypeId === selectedCreditType.id)
                          .map(charge => (
                            <div key={charge.id} className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">
                                {charge.name} 
                                {charge.chargeType === "porcentaje" ? ` (${charge.value}%)` : ""}:
                              </span>
                              <span className="font-medium">
                                {/* @ts-ignore */}
                                {formatCurrency(calculateChargeValue(charge, amount))}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="border-t border-gray-300 my-2 pt-2"></div>
                    <div className="flex justify-between text-lg">
                      <span>Total a pagar:</span>
                      <span className="font-bold text-blue-800">
                        {formatCurrency(simulationResults.totalPayment)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    *Valores referenciales, no son considerados como una oferta
                    formal de préstamo. La oferta definitiva está sujeta al
                    cumplimiento de las condiciones y políticas referente a
                    capacidad de pago.
                  </p>

                  {amortizationData.length > 0 && (
                    <button
                      onClick={() =>
                        setShowAmortizationTable(!showAmortizationTable)
                      }
                      className="w-full mt-4 py-2 text-blue-600 text-center border border-blue-600 rounded hover:bg-blue-50 transition"
                    >
                      {showAmortizationTable
                        ? "Ocultar tabla de amortización"
                        : "Ver tabla de amortización"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabla de Amortización */}
        {showAmortizationTable && amortizationData.length > 0 && (
          <div className="mt-12 overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-blue-800">
                    N
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-blue-800">
                    Cuota Simple
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-blue-800">
                    Cuota Compuesta
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-blue-800">
                    Interés
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-blue-800">
                    Capital
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-blue-800">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.map((row, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-800">{row.N}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-800">
                      {row["Cuota Simple"]}
                    </td>
                    <td className="px-4 py-2 text-sm text-right text-gray-800">
                      {row["Cuota Compuesta"]}
                    </td>
                    <td className="px-4 py-2 text-sm text-right text-gray-800">
                      {row.Interes}
                    </td>
                    <td className="px-4 py-2 text-sm text-right text-gray-800">
                      {row.Capital}
                    </td>
                    <td className="px-4 py-2 text-sm text-right text-gray-800">
                      {row.Saldo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimuladorCredito;