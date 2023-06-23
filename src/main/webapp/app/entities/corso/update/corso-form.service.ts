import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICorso, NewCorso } from '../corso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICorso for edit and NewCorsoFormGroupInput for create.
 */
type CorsoFormGroupInput = ICorso | PartialWithRequiredKeyOf<NewCorso>;

type CorsoFormDefaults = Pick<NewCorso, 'id'>;

type CorsoFormGroupContent = {
  id: FormControl<ICorso['id'] | NewCorso['id']>;
  anno: FormControl<ICorso['anno']>;
  nome: FormControl<ICorso['nome']>;
};

export type CorsoFormGroup = FormGroup<CorsoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CorsoFormService {
  createCorsoFormGroup(corso: CorsoFormGroupInput = { id: null }): CorsoFormGroup {
    const corsoRawValue = {
      ...this.getFormDefaults(),
      ...corso,
    };
    return new FormGroup<CorsoFormGroupContent>({
      id: new FormControl(
        { value: corsoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      anno: new FormControl(corsoRawValue.anno),
      nome: new FormControl(corsoRawValue.nome),
    });
  }

  getCorso(form: CorsoFormGroup): ICorso | NewCorso {
    return form.getRawValue() as ICorso | NewCorso;
  }

  resetForm(form: CorsoFormGroup, corso: CorsoFormGroupInput): void {
    const corsoRawValue = { ...this.getFormDefaults(), ...corso };
    form.reset(
      {
        ...corsoRawValue,
        id: { value: corsoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CorsoFormDefaults {
    return {
      id: null,
    };
  }
}
