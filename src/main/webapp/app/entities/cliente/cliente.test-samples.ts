import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 15344,
};

export const sampleWithPartialData: ICliente = {
  id: 63080,
  cognome: 'unlawful Borders',
};

export const sampleWithFullData: ICliente = {
  id: 5062,
  nome: 'ha purple lightly',
  cognome: 'Metal Miller Outdoors',
};

export const sampleWithNewData: NewCliente = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
