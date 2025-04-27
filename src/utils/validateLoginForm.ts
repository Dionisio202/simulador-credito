export interface LoginFormValues {
    email: string;
    password: string;
  }
  
  export const validateLoginForm = ({ email, password }: LoginFormValues): string | null => {
    if (!email.trim() || !password.trim()) {
      return 'Todos los campos son obligatorios.';
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'El correo electrónico no es válido.';
    }
  
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
  
    return null; // Si todo está bien
  };
  