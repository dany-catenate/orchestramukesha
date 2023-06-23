export interface IClienteCorso {
  id: number;
  id_cliente?: number | null;
  id_corso?: number | null;
  mese?: number | null;
  pagato?: boolean | null;
}

export type NewClienteCorso = Omit<IClienteCorso, 'id'> & { id: null };
