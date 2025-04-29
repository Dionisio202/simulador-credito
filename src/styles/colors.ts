// src/styles/colors.ts

export interface DynamicQuantumColors {
  background: {
    white: string;
    gray: string;
    dark: string;
  };
  text: {
    light: string;
  };
}

let quantumColors: DynamicQuantumColors = {
  background: {
    white: "bg-white",
    gray: "bg-gray-50",
    dark: "bg-gray-900",
  },
  text: {
    light: "text-white",
  },
};

// Función para sobrescribir con valores desde API
export function setQuantumColorsFromAPI(config: any) {
  quantumColors = {
    background: {
      white: config.backgroundWhite || "bg-white",
      gray: config.backgroundGray || "bg-gray-50",
      dark: config.backgroundDark || "bg-gray-900",
    },
    text: {
      light: config.textLight || "text-white",
    },
  };
}

export default quantumColors;
