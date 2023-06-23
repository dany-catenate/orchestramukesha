export interface IInsegnante {
  id: number;
  nome?: string | null;
  cognome?: string | null;
}

export type NewInsegnante = Omit<IInsegnante, 'id'> & { id: null };
