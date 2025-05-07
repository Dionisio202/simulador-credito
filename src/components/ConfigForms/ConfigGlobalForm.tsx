import React, { useEffect, useState } from "react";
import { Pencil, Check, X, Eye, Save, AlertTriangle, RefreshCw } from "lucide-react";
import axios from "axios";

interface ConfigGlobal {
  id: number;
  nombreEmpresa: string;
  logoUrl: string;
  textoPrincipal: string;
  textoSecundario: string;
  textoTerciario: string;
  backgroundWhite: string;
  backgroundGray: string;
  backgroundDark: string;
  textLight: string;
}

interface ColorOption {
  class: string;
  name: string;
}

interface ValidationErrors {
  nombreEmpresa?: string;
  textoPrincipal?: string;
}

// Colores disponibles organizados por categorías
const colorPalette: {
  backgrounds: ColorOption[];
  text: ColorOption[];
} = {
  backgrounds: [
    { class: "bg-white", name: "Blanco" },
    { class: "bg-gray-50", name: "Gris claro" },
    { class: "bg-gray-100", name: "Gris suave" },
    { class: "bg-gray-200", name: "Gris" },
    { class: "bg-gray-800", name: "Gris oscuro" },
    { class: "bg-gray-900", name: "Casi negro" },
    { class: "bg-black", name: "Negro" },
    { class: "bg-blue-600", name: "Azul medio" },
    { class: "bg-blue-700", name: "Azul" },
    { class: "bg-blue-800", name: "Azul oscuro" },
    { class: "bg-blue-900", name: "Azul muy oscuro" }
  ],
  text: [
    { class: "text-white", name: "Blanco" },
    { class: "text-black", name: "Negro" },
    { class: "text-gray-600", name: "Gris medio" },
    { class: "text-gray-700", name: "Gris oscuro" },
    { class: "text-gray-800", name: "Gris muy oscuro" },
    { class: "text-blue-100", name: "Azul muy claro" },
    { class: "text-blue-200", name: "Azul claro" },
    { class: "text-blue-300", name: "Azul suave" }
  ]
};

const CONTRASTE_SUFICIENTE = {
  "bg-black": ["text-white", "text-blue-100", "text-blue-200", "text-blue-300"],
  "bg-gray-900": ["text-white", "text-blue-100", "text-blue-200", "text-blue-300"],
  "bg-gray-800": ["text-white", "text-blue-100", "text-blue-200", "text-blue-300"],
  "bg-blue-900": ["text-white", "text-blue-100", "text-blue-200", "text-blue-300"],
  "bg-blue-800": ["text-white", "text-blue-100", "text-blue-200"],
  "bg-blue-700": ["text-white", "text-blue-100"],
  "bg-blue-600": ["text-white"],
};

const ConfigGlobalForm: React.FC = () => {
  const [config, setConfig] = useState<ConfigGlobal | null>(null);
  const [originalConfig, setOriginalConfig] = useState<ConfigGlobal | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  // Cargar la configuración
  const loadConfig = async (): Promise<void> => {
    setLoading(true);
    setLoadError(null);
    
    try {
      const res = await axios.get("http://localhost:3000/configuration/configuracion-global");
      const configData = res.data[0];
      setConfig(configData);
      setOriginalConfig(JSON.parse(JSON.stringify(configData)));
    } catch (err) {
      console.error("Error al cargar la configuración:", err);
      setLoadError("No se pudo cargar la configuración. Intente recargar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Manejar cambios en los campos de texto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (!config) return;
    const { name, value } = e.target;
    
    // Validación en tiempo real
    if (name === "nombreEmpresa" && !value.trim()) {
      setErrors(prev => ({ ...prev, nombreEmpresa: "El nombre de la empresa es obligatorio" }));
    } else if (name === "nombreEmpresa") {
      setErrors(prev => ({ ...prev, nombreEmpresa: undefined }));
    }
    
    if (name === "textoPrincipal" && value.length > 500) {
      setErrors(prev => ({ ...prev, textoPrincipal: "El texto principal no debe superar los 500 caracteres" }));
    } else if (name === "textoPrincipal") {
      setErrors(prev => ({ ...prev, textoPrincipal: undefined }));
    }
    
    setConfig({ ...config, [name]: value });
  };

  // Manejar cambios de color
  const handleColorChange = (field: keyof ConfigGlobal, value: string): void => {
    if (!config) return;
    
    // Si cambiamos el fondo oscuro, verificamos compatibilidad con el texto claro
    if (field === "backgroundDark") {
      const textosCompatibles = CONTRASTE_SUFICIENTE[value as keyof typeof CONTRASTE_SUFICIENTE] || [];
      if (!textosCompatibles.includes(config.textLight)) {
        // Si el texto actual no es compatible, seleccionamos el primero compatible
        if (textosCompatibles.length > 0) {
          setConfig({ ...config, [field]: value, textLight: textosCompatibles[0] });
          return;
        }
      }
    }
    
    setConfig({ ...config, [field]: value });
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && config) {
      // Validación de tipo y tamaño de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert("Por favor, seleccione un archivo de imagen válido (JPEG, PNG o SVG)");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert("El archivo es demasiado grande. El tamaño máximo es 2MB");
        return;
      }
      
      setLogoFile(file);
      // Mostramos una vista previa local del logo
      setConfig({ ...config, logoUrl: URL.createObjectURL(file) });
    }
  };

  // Validar antes de enviar
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    
    if (!config) return false;
    
    if (!config.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = "El nombre de la empresa es obligatorio";
      isValid = false;
    }
    
    if (config.textoPrincipal && config.textoPrincipal.length > 500) {
      newErrors.textoPrincipal = "El texto principal no debe superar los 500 caracteres";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Enviar el formulario
  const handleSubmit = async (): Promise<void> => {
    if (!config) return;
  
    if (!validateForm()) {
      alert("Por favor, corrija los errores en el formulario antes de guardar");
      return;
    }
  
    setSaving(true);
  
    try {
      // Subir imagen si hay una nueva
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
  
        await axios.post("http://localhost:3000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      // Actualizar texto y colores
      const updatedConfig = {
        id: config.id,
        nombreEmpresa: config.nombreEmpresa.trim(),
        textoPrincipal: config.textoPrincipal ?? '',
        textoSecundario: config.textoSecundario ?? '',
        textoTerciario: config.textoTerciario ?? '',
        backgroundWhite: config.backgroundWhite,
        backgroundGray: config.backgroundGray,
        backgroundDark: config.backgroundDark,
        textLight: config.textLight,
      };
  
      await axios.put("http://localhost:3000/configuration/configuracion-global", updatedConfig);
  
      // ✅ Recargar config para obtener el nuevo logo_url desde la base de datos
      await loadConfig();
  
      setEditMode(false);
      alert("Configuración actualizada correctamente");
    } catch (err) {
      console.error("Error al actualizar la configuración:", err);
      alert("Error al actualizar la configuración");
    } finally {
      setSaving(false);
    }
  };
  

  // Cancelar y restaurar valores originales
  const handleCancel = (): void => {
    if (originalConfig) {
      setConfig(JSON.parse(JSON.stringify(originalConfig)));
    }
    setEditMode(false);
    setErrors({});
  };

  // Componente de selección de colores
  interface ColorSelectorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    colorType: 'text' | 'background';
    disabled?: boolean;
    helperText?: string;
  }

  const ColorSelector: React.FC<ColorSelectorProps> = ({ 
    label, 
    value, 
    onChange, 
    colorType,
    disabled = false,
    helperText
  }) => {
    const colors = colorType === "text" ? colorPalette.text : colorPalette.backgrounds;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
          {colors.map(color => {
            // Para el selector de texto claro, si estamos en modo edición,
            // deshabilitamos los colores que no dan suficiente contraste con el fondo oscuro
            const isCompatible = colorType !== 'text' || 
              !CONTRASTE_SUFICIENTE[config?.backgroundDark as keyof typeof CONTRASTE_SUFICIENTE] ||
              CONTRASTE_SUFICIENTE[config?.backgroundDark as keyof typeof CONTRASTE_SUFICIENTE].includes(color.class);
            
            const isDisabled = disabled || (colorType === 'text' && !isCompatible);
            
            return (
              <div
                key={color.class}
                onClick={() => !isDisabled && editMode && onChange(color.class)}
                className={`
                  h-8 w-full rounded-md border flex items-center justify-center
                  ${color.class === 'bg-white' ? 'border-gray-300' : ''}
                  ${color.class}
                  ${value === color.class ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                  ${!editMode || isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:ring-1 hover:ring-blue-300'}
                `}
                title={`${color.name}${!isCompatible ? ' (No compatible con el fondo seleccionado)' : ''}`}
              >
                {value === color.class && <Check size={16} className={color.class.includes('white') ? 'text-black' : 'text-white'} />}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between items-center">
          <span className="text-xs text-gray-500">Seleccionado: {value}</span>
          {helperText && <span className="text-xs text-blue-600">{helperText}</span>}
        </div>
      </div>
    );
  };

  // Estado de carga
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Cargando configuración...</p>
      </div>
    </div>
  );
  
  // Error de carga
  if (loadError) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center space-y-4">
        <AlertTriangle size={48} className="mx-auto text-red-500" />
        <p className="text-red-600">{loadError}</p>
        <button 
          onClick={loadConfig}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mx-auto"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    </div>
  );

  // Si no hay configuración todavía
  if (!config) return null;

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Configuración Global</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            title="Vista previa"
          >
            <Eye size={18} />
            <span className="hidden sm:inline">Vista previa</span>
          </button>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700"
            >
              <Pencil size={18} />
              <span className="hidden sm:inline">Editar</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <X size={18} />
                <span className="hidden sm:inline">Cancelar</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || Object.values(errors).some((val) => !!val)}
                className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                  saving || Object.values(errors).some((val) => !!val) 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                <span className="hidden sm:inline">{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vista previa */}
      {showPreview && (
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium mb-3">Vista previa de colores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${config.backgroundWhite} rounded-lg p-6 shadow`}>
              <div className="font-medium">Fondo claro ({config.backgroundWhite})</div>
              <p className="mt-2">Ejemplo de texto en este fondo</p>
            </div>
            <div className={`${config.backgroundGray} rounded-lg p-6 shadow`}>
              <div className="font-medium">Fondo gris ({config.backgroundGray})</div>
              <p className="mt-2">Ejemplo de texto en este fondo</p>
            </div>
            <div className={`${config.backgroundDark} ${config.textLight} rounded-lg p-6 shadow`}>
              <div className="font-medium">Fondo oscuro ({config.backgroundDark})</div>
              <p className="mt-2">Texto claro ({config.textLight})</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Empresa <span className="text-red-500">*</span>
            </label>
            <input
              name="nombreEmpresa"
              value={config.nombreEmpresa}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full border ${
                errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'
              } rounded-md px-3 py-2 ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
            />
            {errors.nombreEmpresa && (
              <p className="text-red-500 text-xs mt-1">{errors.nombreEmpresa}</p>
            )}
          </div>

          <div className="space-y-0">
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="flex items-center gap-3">
              {config.logoUrl && (
                <div className="h-30 w-80 flex items-center">
                  <img src={"http://localhost:3000/"+config.logoUrl} alt="Logo" className="h-full object-contain" />
                </div>
              )}
              {editMode && (
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos: JPG, PNG, SVG. Tamaño máximo: 2MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Texto Principal
              <span className="text-xs text-gray-500 ml-2">
                ({config.textoPrincipal?.length || 0}/500)
              </span>
            </label>
            <textarea
              name="textoPrincipal"
              value={config.textoPrincipal || ''}
              onChange={handleChange}
              disabled={!editMode}
              rows={2}
              className={`w-full border ${
                errors.textoPrincipal ? 'border-red-500' : 'border-gray-300'
              } rounded-md px-3 py-2 ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
            />
            {errors.textoPrincipal && (
              <p className="text-red-500 text-xs mt-1">{errors.textoPrincipal}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Texto Secundario</label>
            <textarea
              name="textoSecundario"
              value={config.textoSecundario || ''}
              onChange={handleChange}
              disabled={!editMode}
              rows={2}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Texto Terciario</label>
            <textarea
              name="textoTerciario"
              value={config.textoTerciario || ''}
              onChange={handleChange}
              disabled={!editMode}
              rows={2}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${!editMode ? 'bg-gray-50' : 'bg-white'}`}
            />
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <h3 className="text-lg font-medium mb-4">Paleta de Colores</h3>
          <div className="space-y-6">
            <ColorSelector 
              label="Fondo Claro" 
              value={config.backgroundWhite} 
              onChange={(value) => handleColorChange("backgroundWhite", value)}
              colorType="background" 
              disabled={!editMode}
            />
            <ColorSelector 
              label="Fondo Gris" 
              value={config.backgroundGray} 
              onChange={(value) => handleColorChange("backgroundGray", value)}
              colorType="background" 
              disabled={!editMode}
            />
            <ColorSelector 
              label="Fondo Oscuro" 
              value={config.backgroundDark} 
              onChange={(value) => handleColorChange("backgroundDark", value)}
              colorType="background" 
              disabled={!editMode}
              helperText="Al cambiar este color, el texto claro se ajustará automáticamente para mantener contraste"
            />
            <ColorSelector 
              label="Texto Claro" 
              value={config.textLight} 
              onChange={(value) => handleColorChange("textLight", value)}
              colorType="text" 
              disabled={!editMode}
              helperText="Solo se muestran colores compatibles con el fondo oscuro seleccionado"
            />
          </div>
        </div>
      </div>

      {/* Información de campos requeridos */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> Campos obligatorios
        </p>
      </div>
    </div>
  );
};

export default ConfigGlobalForm;