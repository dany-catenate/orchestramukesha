import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../concerto.test-samples';

import { ConcertoFormService } from './concerto-form.service';

describe('Concerto Form Service', () => {
  let service: ConcertoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcertoFormService);
  });

  describe('Service methods', () => {
    describe('createConcertoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConcertoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            data: expect.any(Object),
            nome: expect.any(Object),
            corso: expect.any(Object),
          })
        );
      });

      it('passing IConcerto should create a new form with FormGroup', () => {
        const formGroup = service.createConcertoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            data: expect.any(Object),
            nome: expect.any(Object),
            corso: expect.any(Object),
          })
        );
      });
    });

    describe('getConcerto', () => {
      it('should return NewConcerto for default Concerto initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConcertoFormGroup(sampleWithNewData);

        const concerto = service.getConcerto(formGroup) as any;

        expect(concerto).toMatchObject(sampleWithNewData);
      });

      it('should return NewConcerto for empty Concerto initial value', () => {
        const formGroup = service.createConcertoFormGroup();

        const concerto = service.getConcerto(formGroup) as any;

        expect(concerto).toMatchObject({});
      });

      it('should return IConcerto', () => {
        const formGroup = service.createConcertoFormGroup(sampleWithRequiredData);

        const concerto = service.getConcerto(formGroup) as any;

        expect(concerto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConcerto should not enable id FormControl', () => {
        const formGroup = service.createConcertoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConcerto should disable id FormControl', () => {
        const formGroup = service.createConcertoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
