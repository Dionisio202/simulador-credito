import React from 'react';

const ConfigInterfaz: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Configuración de la Interfaz</h1>
        <p className="text-gray-600">
          Aquí podrás personalizar elementos de la apariencia de la plataforma para los usuarios finales.
        </p>
      </div>
    </div>
  );
};

export default ConfigInterfaz;
