import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConcerto, NewConcerto } from '../concerto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConcerto for edit and NewConcertoFormGroupInput for create.
 */
type ConcertoFormGroupInput = IConcerto | PartialWithRequiredKeyOf<NewConcerto>;

type ConcertoFormDefaults = Pick<NewConcerto, 'id'>;

type ConcertoFormGroupContent = {
  id: FormControl<IConcerto['id'] | NewConcerto['id']>;
  data: FormControl<IConcerto['data']>;
  nome: FormControl<IConcerto['nome']>;
  corso: FormControl<IConcerto['corso']>;
};

export type ConcertoFormGroup = FormGroup<ConcertoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConcertoFormService {
  createConcertoFormGroup(concerto: ConcertoFormGroupInput = { id: null }): ConcertoFormGroup {
    const concertoRawValue = {
      ...this.getFormDefaults(),
      ...concerto,
    };
    return new FormGroup<ConcertoFormGroupContent>({
      id: new FormControl(
        { value: concertoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      data: new FormControl(concertoRawValue.data),
      nome: new FormControl(concertoRawValue.nome),
      corso: new FormControl(concertoRawValue.corso),
    });
  }

  getConcerto(form: ConcertoFormGroup): IConcerto | NewConcerto {
    return form.getRawValue() as IConcerto | NewConcerto;
  }

  resetForm(form: ConcertoFormGroup, concerto: ConcertoFormGroupInput): void {
    const concertoRawValue = { ...this.getFormDefaults(), ...concerto };
    form.reset(
      {
        ...concertoRawValue,
        id: { value: concertoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConcertoFormDefaults {
    return {
      id: null,
    };
  }
}
