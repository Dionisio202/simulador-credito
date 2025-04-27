// src/config/settings.ts

export const settings = {
    companyName: "Quantum Capital",
    logoUrl: "../assets/logo-banco.png",
    primaryColor: "bg-blue-600",
    primaryColorHover: "bg-blue-700",
    textColor: "text-gray-800",
    menuBackground: "bg-white",
  
    menuItems: [
      { label: "Inicio", path: "/" },
      {
        label: "Productos",
        path: "#",
        hasSubmenu: true,
        submenu: [
          {
            category: "PRODUCTOS DESTACADOS",
            items: [
              { label: "Simulador de Crédito", path: "/simulador-credito" },
              { label: "Simulador de Inversión", path: "/simulador-inversion" },
            ],
          },
        ],
      },
      {
        label: "Visión del mercado",
        path: "/vision-mercado",
        hasSubmenu: true,
        submenu: [
          {
            category: "ANÁLISIS DE MERCADO",
            items: [
              { label: "Informes económicos", path: "/vision-mercado/informes" },
              { label: "Perspectivas de inversión", path: "/vision-mercado/perspectivas" },
            ],
          },
        ],
      },
    ],
  };
  