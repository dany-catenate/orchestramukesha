import { IClienteCorso, NewClienteCorso } from './cliente-corso.model';

export const sampleWithRequiredData: IClienteCorso = {
  id: 42357,
};

export const sampleWithPartialData: IClienteCorso = {
  id: 40744,
  id_cliente: 3178,
  id_corso: 37469,
  mese: 34516,
};

export const sampleWithFullData: IClienteCorso = {
  id: 65846,
  id_cliente: 42253,
  id_corso: 44514,
  mese: 32044,
  pagato: true,
};

export const sampleWithNewData: NewClienteCorso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
