import { IInsegnanteCorso, NewInsegnanteCorso } from './insegnante-corso.model';

export const sampleWithRequiredData: IInsegnanteCorso = {
  id: 1289,
};

export const sampleWithPartialData: IInsegnanteCorso = {
  id: 46344,
  mese: 6271,
};

export const sampleWithFullData: IInsegnanteCorso = {
  id: 75677,
  id_insegnante: 67419,
  id_corso: 20849,
  mese: 38674,
};

export const sampleWithNewData: NewInsegnanteCorso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
