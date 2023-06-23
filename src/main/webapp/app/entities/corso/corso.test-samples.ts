import { ICorso, NewCorso } from './corso.model';

export const sampleWithRequiredData: ICorso = {
  id: 23132,
};

export const sampleWithPartialData: ICorso = {
  id: 53872,
  nome: 'than grey back',
};

export const sampleWithFullData: ICorso = {
  id: 10466,
  anno: 25772,
  nome: 'pro Bedfordshire Configurable',
};

export const sampleWithNewData: NewCorso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
