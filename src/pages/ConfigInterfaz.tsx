import React from 'react';

const ConfigInversiones: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Configuración de Inversiones</h1>
        <p className="text-gray-600">
          Aquí podrás definir estrategias y configurar los productos de inversión que se ofrecen.
        </p>
      </div>
    </div>
  );
};

export default ConfigInversiones;
