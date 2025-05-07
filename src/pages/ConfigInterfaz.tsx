import React from 'react';
import ConfigGlobalForm from '../components/ConfigForms/ConfigGlobalForm';
import HomeBannerForm from '../components/ConfigForms/HomeBannerForm';
import HomeContactoForm from '../components/ConfigForms/HomeContactoForm';
import HomeServiciosForm from '../components/ConfigForms/HomeServiciosForm';
import HomeTestimoniosForm from '../components/ConfigForms/HomeTestimoniosForm';
import NavbarConfigForm from '../components/ConfigForms/NavbarConfigForm';
import PerspectivasMercadoForm from '../components/ConfigForms/PerspectivasMercadoForm';
import QuienesSomosForm from '../components/ConfigForms/QuienesSomosForm.tsx';

const ConfigInterfaz: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Configuración del sitio web</h1>

      <ConfigGlobalForm />
      <HomeBannerForm />
      <HomeContactoForm />
      <HomeServiciosForm />
      <HomeTestimoniosForm />
      {/* <NavbarConfigForm /> */}
      <PerspectivasMercadoForm />
      <QuienesSomosForm />

    </div>
  );
};

export default ConfigInterfaz;
