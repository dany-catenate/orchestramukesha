import { IConcerto } from 'app/entities/concerto/concerto.model';

export interface IFoto {
  id: number;
  blob?: string | null;
  blobContentType?: string | null;
  nome_file?: string | null;
  concerto?: Pick<IConcerto, 'id'> | null;
}

export type NewFoto = Omit<IFoto, 'id'> & { id: null };
