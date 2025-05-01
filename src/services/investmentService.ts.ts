// src/api/investmentApi.ts
import { API_URL } from '../constants/api';

const BASE_URL = `${API_URL}/sim/investment`;
interface TasaInversion {
    id: number;
    montoDesde: number;
    montoHasta?: number;
    plazoDesde: number;
    plazoHasta?: number;
    tasa: number;
  }
// investmentService.ts
export const getAllTasas = async (): Promise<TasaInversion[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al cargar tasas');
    
    const data = await res.json();
  
    // Aquí transformas los datos del backend a lo que espera tu frontend
    return data.map((item: any) => ({
      id: item.id,
      montoDesde: item.min_amount,
      montoHasta: item.max_amount ?? undefined,
      plazoDesde: item.min_term_months,
      plazoHasta: item.max_term_months ?? undefined,
      tasa: item.interest_rate
    }));
  };
  

  export const createTasa = async (tasa: Omit<TasaInversion, 'id'>): Promise<TasaInversion> => {
    const payload = {
        min_amount: tasa.montoDesde,
        max_amount: tasa.montoHasta ,
        min_term_months: tasa.plazoDesde,
        max_term_months: tasa.plazoHasta ,
        interest_rate: tasa.tasa
      };
      
  
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error('Error al crear tasa');
  
    const data = await res.json();
  
    // Transformamos también la respuesta
    return {
      id: data.id,
      montoDesde: data.min_amount,
      montoHasta: data.max_amount ?? undefined,
      plazoDesde: data.min_term_months,
      plazoHasta: data.max_term_months ?? undefined,
      tasa: data.interest_rate
    };
  };
  

  export const updateTasa = async (id: number, tasa: Omit<TasaInversion, 'id'>): Promise<void> => {
    const payload = {
      id, // se mantiene porque el controlador lo espera en el cuerpo
      minAmount: tasa.montoDesde,
      maxAmount: tasa.montoHasta ?? null,
      minTermMonths: tasa.plazoDesde,
      maxTermMonths: tasa.plazoHasta ?? null,
      interestRate: tasa.tasa
    };
  
    const res = await fetch(`${BASE_URL}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error('Error al actualizar tasa');
  };
  
  

  export const deleteTasa = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar tasa');
  };
  
