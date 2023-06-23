import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../filmato.test-samples';

import { FilmatoFormService } from './filmato-form.service';

describe('Filmato Form Service', () => {
  let service: FilmatoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmatoFormService);
  });

  describe('Service methods', () => {
    describe('createFilmatoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFilmatoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            blob: expect.any(Object),
            nome_file: expect.any(Object),
            concerto: expect.any(Object),
          })
        );
      });

      it('passing IFilmato should create a new form with FormGroup', () => {
        const formGroup = service.createFilmatoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            blob: expect.any(Object),
            nome_file: expect.any(Object),
            concerto: expect.any(Object),
          })
        );
      });
    });

    describe('getFilmato', () => {
      it('should return NewFilmato for default Filmato initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFilmatoFormGroup(sampleWithNewData);

        const filmato = service.getFilmato(formGroup) as any;

        expect(filmato).toMatchObject(sampleWithNewData);
      });

      it('should return NewFilmato for empty Filmato initial value', () => {
        const formGroup = service.createFilmatoFormGroup();

        const filmato = service.getFilmato(formGroup) as any;

        expect(filmato).toMatchObject({});
      });

      it('should return IFilmato', () => {
        const formGroup = service.createFilmatoFormGroup(sampleWithRequiredData);

        const filmato = service.getFilmato(formGroup) as any;

        expect(filmato).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFilmato should not enable id FormControl', () => {
        const formGroup = service.createFilmatoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFilmato should disable id FormControl', () => {
        const formGroup = service.createFilmatoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
