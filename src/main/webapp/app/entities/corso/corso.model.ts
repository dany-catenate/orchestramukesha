export interface ICorso {
  id: number;
  anno?: number | null;
  nome?: string | null;
}

export type NewCorso = Omit<ICorso, 'id'> & { id: null };
