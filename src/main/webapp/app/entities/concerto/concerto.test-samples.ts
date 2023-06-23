import dayjs from 'dayjs/esm';

import { IConcerto, NewConcerto } from './concerto.model';

export const sampleWithRequiredData: IConcerto = {
  id: 53879,
};

export const sampleWithPartialData: IConcerto = {
  id: 86299,
};

export const sampleWithFullData: IConcerto = {
  id: 15295,
  data: dayjs('2023-06-21'),
  nome: 'debitis website up',
};

export const sampleWithNewData: NewConcerto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
