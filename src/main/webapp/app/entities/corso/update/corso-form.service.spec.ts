import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../corso.test-samples';

import { CorsoFormService } from './corso-form.service';

describe('Corso Form Service', () => {
  let service: CorsoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorsoFormService);
  });

  describe('Service methods', () => {
    describe('createCorsoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCorsoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            anno: expect.any(Object),
            nome: expect.any(Object),
          })
        );
      });

      it('passing ICorso should create a new form with FormGroup', () => {
        const formGroup = service.createCorsoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            anno: expect.any(Object),
            nome: expect.any(Object),
          })
        );
      });
    });

    describe('getCorso', () => {
      it('should return NewCorso for default Corso initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCorsoFormGroup(sampleWithNewData);

        const corso = service.getCorso(formGroup) as any;

        expect(corso).toMatchObject(sampleWithNewData);
      });

      it('should return NewCorso for empty Corso initial value', () => {
        const formGroup = service.createCorsoFormGroup();

        const corso = service.getCorso(formGroup) as any;

        expect(corso).toMatchObject({});
      });

      it('should return ICorso', () => {
        const formGroup = service.createCorsoFormGroup(sampleWithRequiredData);

        const corso = service.getCorso(formGroup) as any;

        expect(corso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICorso should not enable id FormControl', () => {
        const formGroup = service.createCorsoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCorso should disable id FormControl', () => {
        const formGroup = service.createCorsoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
