import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFilmato, NewFilmato } from '../filmato.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFilmato for edit and NewFilmatoFormGroupInput for create.
 */
type FilmatoFormGroupInput = IFilmato | PartialWithRequiredKeyOf<NewFilmato>;

type FilmatoFormDefaults = Pick<NewFilmato, 'id'>;

type FilmatoFormGroupContent = {
  id: FormControl<IFilmato['id'] | NewFilmato['id']>;
  blob: FormControl<IFilmato['blob']>;
  blobContentType: FormControl<IFilmato['blobContentType']>;
  nome_file: FormControl<IFilmato['nome_file']>;
  concerto: FormControl<IFilmato['concerto']>;
};

export type FilmatoFormGroup = FormGroup<FilmatoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FilmatoFormService {
  createFilmatoFormGroup(filmato: FilmatoFormGroupInput = { id: null }): FilmatoFormGroup {
    const filmatoRawValue = {
      ...this.getFormDefaults(),
      ...filmato,
    };
    return new FormGroup<FilmatoFormGroupContent>({
      id: new FormControl(
        { value: filmatoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      blob: new FormControl(filmatoRawValue.blob),
      blobContentType: new FormControl(filmatoRawValue.blobContentType),
      nome_file: new FormControl(filmatoRawValue.nome_file),
      concerto: new FormControl(filmatoRawValue.concerto),
    });
  }

  getFilmato(form: FilmatoFormGroup): IFilmato | NewFilmato {
    return form.getRawValue() as IFilmato | NewFilmato;
  }

  resetForm(form: FilmatoFormGroup, filmato: FilmatoFormGroupInput): void {
    const filmatoRawValue = { ...this.getFormDefaults(), ...filmato };
    form.reset(
      {
        ...filmatoRawValue,
        id: { value: filmatoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FilmatoFormDefaults {
    return {
      id: null,
    };
  }
}
