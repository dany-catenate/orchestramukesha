import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../insegnante.test-samples';

import { InsegnanteFormService } from './insegnante-form.service';

describe('Insegnante Form Service', () => {
  let service: InsegnanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsegnanteFormService);
  });

  describe('Service methods', () => {
    describe('createInsegnanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInsegnanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cognome: expect.any(Object),
          })
        );
      });

      it('passing IInsegnante should create a new form with FormGroup', () => {
        const formGroup = service.createInsegnanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cognome: expect.any(Object),
          })
        );
      });
    });

    describe('getInsegnante', () => {
      it('should return NewInsegnante for default Insegnante initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInsegnanteFormGroup(sampleWithNewData);

        const insegnante = service.getInsegnante(formGroup) as any;

        expect(insegnante).toMatchObject(sampleWithNewData);
      });

      it('should return NewInsegnante for empty Insegnante initial value', () => {
        const formGroup = service.createInsegnanteFormGroup();

        const insegnante = service.getInsegnante(formGroup) as any;

        expect(insegnante).toMatchObject({});
      });

      it('should return IInsegnante', () => {
        const formGroup = service.createInsegnanteFormGroup(sampleWithRequiredData);

        const insegnante = service.getInsegnante(formGroup) as any;

        expect(insegnante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInsegnante should not enable id FormControl', () => {
        const formGroup = service.createInsegnanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInsegnante should disable id FormControl', () => {
        const formGroup = service.createInsegnanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
