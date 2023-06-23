import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInsegnante, NewInsegnante } from '../insegnante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInsegnante for edit and NewInsegnanteFormGroupInput for create.
 */
type InsegnanteFormGroupInput = IInsegnante | PartialWithRequiredKeyOf<NewInsegnante>;

type InsegnanteFormDefaults = Pick<NewInsegnante, 'id'>;

type InsegnanteFormGroupContent = {
  id: FormControl<IInsegnante['id'] | NewInsegnante['id']>;
  nome: FormControl<IInsegnante['nome']>;
  cognome: FormControl<IInsegnante['cognome']>;
};

export type InsegnanteFormGroup = FormGroup<InsegnanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InsegnanteFormService {
  createInsegnanteFormGroup(insegnante: InsegnanteFormGroupInput = { id: null }): InsegnanteFormGroup {
    const insegnanteRawValue = {
      ...this.getFormDefaults(),
      ...insegnante,
    };
    return new FormGroup<InsegnanteFormGroupContent>({
      id: new FormControl(
        { value: insegnanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(insegnanteRawValue.nome),
      cognome: new FormControl(insegnanteRawValue.cognome),
    });
  }

  getInsegnante(form: InsegnanteFormGroup): IInsegnante | NewInsegnante {
    return form.getRawValue() as IInsegnante | NewInsegnante;
  }

  resetForm(form: InsegnanteFormGroup, insegnante: InsegnanteFormGroupInput): void {
    const insegnanteRawValue = { ...this.getFormDefaults(), ...insegnante };
    form.reset(
      {
        ...insegnanteRawValue,
        id: { value: insegnanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InsegnanteFormDefaults {
    return {
      id: null,
    };
  }
}
