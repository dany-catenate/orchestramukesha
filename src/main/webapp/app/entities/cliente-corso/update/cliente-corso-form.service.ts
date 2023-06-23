import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClienteCorso, NewClienteCorso } from '../cliente-corso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClienteCorso for edit and NewClienteCorsoFormGroupInput for create.
 */
type ClienteCorsoFormGroupInput = IClienteCorso | PartialWithRequiredKeyOf<NewClienteCorso>;

type ClienteCorsoFormDefaults = Pick<NewClienteCorso, 'id' | 'pagato'>;

type ClienteCorsoFormGroupContent = {
  id: FormControl<IClienteCorso['id'] | NewClienteCorso['id']>;
  id_cliente: FormControl<IClienteCorso['id_cliente']>;
  id_corso: FormControl<IClienteCorso['id_corso']>;
  mese: FormControl<IClienteCorso['mese']>;
  pagato: FormControl<IClienteCorso['pagato']>;
};

export type ClienteCorsoFormGroup = FormGroup<ClienteCorsoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClienteCorsoFormService {
  createClienteCorsoFormGroup(clienteCorso: ClienteCorsoFormGroupInput = { id: null }): ClienteCorsoFormGroup {
    const clienteCorsoRawValue = {
      ...this.getFormDefaults(),
      ...clienteCorso,
    };
    return new FormGroup<ClienteCorsoFormGroupContent>({
      id: new FormControl(
        { value: clienteCorsoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      id_cliente: new FormControl(clienteCorsoRawValue.id_cliente),
      id_corso: new FormControl(clienteCorsoRawValue.id_corso),
      mese: new FormControl(clienteCorsoRawValue.mese),
      pagato: new FormControl(clienteCorsoRawValue.pagato),
    });
  }

  getClienteCorso(form: ClienteCorsoFormGroup): IClienteCorso | NewClienteCorso {
    return form.getRawValue() as IClienteCorso | NewClienteCorso;
  }

  resetForm(form: ClienteCorsoFormGroup, clienteCorso: ClienteCorsoFormGroupInput): void {
    const clienteCorsoRawValue = { ...this.getFormDefaults(), ...clienteCorso };
    form.reset(
      {
        ...clienteCorsoRawValue,
        id: { value: clienteCorsoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClienteCorsoFormDefaults {
    return {
      id: null,
      pagato: false,
    };
  }
}
