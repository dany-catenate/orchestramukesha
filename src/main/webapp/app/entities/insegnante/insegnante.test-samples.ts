import { IInsegnante, NewInsegnante } from './insegnante.model';

export const sampleWithRequiredData: IInsegnante = {
  id: 64689,
};

export const sampleWithPartialData: IInsegnante = {
  id: 82947,
  nome: 'pish mole',
  cognome: 'bah throughput Hybrid',
};

export const sampleWithFullData: IInsegnante = {
  id: 87656,
  nome: 'circuit contingency',
  cognome: 'Wagon Refined orange',
};

export const sampleWithNewData: NewInsegnante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
