import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../cliente-corso.test-samples';

import { ClienteCorsoFormService } from './cliente-corso-form.service';

describe('ClienteCorso Form Service', () => {
  let service: ClienteCorsoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteCorsoFormService);
  });

  describe('Service methods', () => {
    describe('createClienteCorsoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClienteCorsoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            id_cliente: expect.any(Object),
            id_corso: expect.any(Object),
            mese: expect.any(Object),
            pagato: expect.any(Object),
          })
        );
      });

      it('passing IClienteCorso should create a new form with FormGroup', () => {
        const formGroup = service.createClienteCorsoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            id_cliente: expect.any(Object),
            id_corso: expect.any(Object),
            mese: expect.any(Object),
            pagato: expect.any(Object),
          })
        );
      });
    });

    describe('getClienteCorso', () => {
      it('should return NewClienteCorso for default ClienteCorso initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createClienteCorsoFormGroup(sampleWithNewData);

        const clienteCorso = service.getClienteCorso(formGroup) as any;

        expect(clienteCorso).toMatchObject(sampleWithNewData);
      });

      it('should return NewClienteCorso for empty ClienteCorso initial value', () => {
        const formGroup = service.createClienteCorsoFormGroup();

        const clienteCorso = service.getClienteCorso(formGroup) as any;

        expect(clienteCorso).toMatchObject({});
      });

      it('should return IClienteCorso', () => {
        const formGroup = service.createClienteCorsoFormGroup(sampleWithRequiredData);

        const clienteCorso = service.getClienteCorso(formGroup) as any;

        expect(clienteCorso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClienteCorso should not enable id FormControl', () => {
        const formGroup = service.createClienteCorsoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClienteCorso should disable id FormControl', () => {
        const formGroup = service.createClienteCorsoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
