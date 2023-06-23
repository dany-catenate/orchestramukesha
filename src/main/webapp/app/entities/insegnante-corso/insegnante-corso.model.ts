export interface IInsegnanteCorso {
  id: number;
  id_insegnante?: number | null;
  id_corso?: number | null;
  mese?: number | null;
}

export type NewInsegnanteCorso = Omit<IInsegnanteCorso, 'id'> & { id: null };
