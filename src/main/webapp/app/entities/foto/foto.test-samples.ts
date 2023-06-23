import { IFoto, NewFoto } from './foto.model';

export const sampleWithRequiredData: IFoto = {
  id: 20369,
};

export const sampleWithPartialData: IFoto = {
  id: 42583,
  blob: '../fake-data/blob/hipster.png',
  blobContentType: 'unknown',
};

export const sampleWithFullData: IFoto = {
  id: 32949,
  blob: '../fake-data/blob/hipster.png',
  blobContentType: 'unknown',
  nome_file: 'North Guatemala',
};

export const sampleWithNewData: NewFoto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
