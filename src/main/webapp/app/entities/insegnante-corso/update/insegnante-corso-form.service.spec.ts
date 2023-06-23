import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../insegnante-corso.test-samples';

import { InsegnanteCorsoFormService } from './insegnante-corso-form.service';

describe('InsegnanteCorso Form Service', () => {
  let service: InsegnanteCorsoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsegnanteCorsoFormService);
  });

  describe('Service methods', () => {
    describe('createInsegnanteCorsoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            id_insegnante: expect.any(Object),
            id_corso: expect.any(Object),
            mese: expect.any(Object),
          })
        );
      });

      it('passing IInsegnanteCorso should create a new form with FormGroup', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            id_insegnante: expect.any(Object),
            id_corso: expect.any(Object),
            mese: expect.any(Object),
          })
        );
      });
    });

    describe('getInsegnanteCorso', () => {
      it('should return NewInsegnanteCorso for default InsegnanteCorso initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInsegnanteCorsoFormGroup(sampleWithNewData);

        const insegnanteCorso = service.getInsegnanteCorso(formGroup) as any;

        expect(insegnanteCorso).toMatchObject(sampleWithNewData);
      });

      it('should return NewInsegnanteCorso for empty InsegnanteCorso initial value', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup();

        const insegnanteCorso = service.getInsegnanteCorso(formGroup) as any;

        expect(insegnanteCorso).toMatchObject({});
      });

      it('should return IInsegnanteCorso', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup(sampleWithRequiredData);

        const insegnanteCorso = service.getInsegnanteCorso(formGroup) as any;

        expect(insegnanteCorso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInsegnanteCorso should not enable id FormControl', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInsegnanteCorso should disable id FormControl', () => {
        const formGroup = service.createInsegnanteCorsoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
