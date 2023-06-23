import dayjs from 'dayjs/esm';
import { ICorso } from 'app/entities/corso/corso.model';

export interface IConcerto {
  id: number;
  data?: dayjs.Dayjs | null;
  nome?: string | null;
  corso?: Pick<ICorso, 'id'> | null;
}

export type NewConcerto = Omit<IConcerto, 'id'> & { id: null };
