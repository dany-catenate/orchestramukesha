import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInsegnanteCorso, NewInsegnanteCorso } from '../insegnante-corso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInsegnanteCorso for edit and NewInsegnanteCorsoFormGroupInput for create.
 */
type InsegnanteCorsoFormGroupInput = IInsegnanteCorso | PartialWithRequiredKeyOf<NewInsegnanteCorso>;

type InsegnanteCorsoFormDefaults = Pick<NewInsegnanteCorso, 'id'>;

type InsegnanteCorsoFormGroupContent = {
  id: FormControl<IInsegnanteCorso['id'] | NewInsegnanteCorso['id']>;
  id_insegnante: FormControl<IInsegnanteCorso['id_insegnante']>;
  id_corso: FormControl<IInsegnanteCorso['id_corso']>;
  mese: FormControl<IInsegnanteCorso['mese']>;
};

export type InsegnanteCorsoFormGroup = FormGroup<InsegnanteCorsoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InsegnanteCorsoFormService {
  createInsegnanteCorsoFormGroup(insegnanteCorso: InsegnanteCorsoFormGroupInput = { id: null }): InsegnanteCorsoFormGroup {
    const insegnanteCorsoRawValue = {
      ...this.getFormDefaults(),
      ...insegnanteCorso,
    };
    return new FormGroup<InsegnanteCorsoFormGroupContent>({
      id: new FormControl(
        { value: insegnanteCorsoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      id_insegnante: new FormControl(insegnanteCorsoRawValue.id_insegnante),
      id_corso: new FormControl(insegnanteCorsoRawValue.id_corso),
      mese: new FormControl(insegnanteCorsoRawValue.mese),
    });
  }

  getInsegnanteCorso(form: InsegnanteCorsoFormGroup): IInsegnanteCorso | NewInsegnanteCorso {
    return form.getRawValue() as IInsegnanteCorso | NewInsegnanteCorso;
  }

  resetForm(form: InsegnanteCorsoFormGroup, insegnanteCorso: InsegnanteCorsoFormGroupInput): void {
    const insegnanteCorsoRawValue = { ...this.getFormDefaults(), ...insegnanteCorso };
    form.reset(
      {
        ...insegnanteCorsoRawValue,
        id: { value: insegnanteCorsoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InsegnanteCorsoFormDefaults {
    return {
      id: null,
    };
  }
}
