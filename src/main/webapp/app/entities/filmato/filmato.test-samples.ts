import { IFilmato, NewFilmato } from './filmato.model';

export const sampleWithRequiredData: IFilmato = {
  id: 15674,
};

export const sampleWithPartialData: IFilmato = {
  id: 83265,
};

export const sampleWithFullData: IFilmato = {
  id: 79519,
  blob: '../fake-data/blob/hipster.png',
  blobContentType: 'unknown',
  nome_file: 'EXE',
};

export const sampleWithNewData: NewFilmato = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
