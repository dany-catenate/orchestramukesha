import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFoto, NewFoto } from '../foto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFoto for edit and NewFotoFormGroupInput for create.
 */
type FotoFormGroupInput = IFoto | PartialWithRequiredKeyOf<NewFoto>;

type FotoFormDefaults = Pick<NewFoto, 'id'>;

type FotoFormGroupContent = {
  id: FormControl<IFoto['id'] | NewFoto['id']>;
  blob: FormControl<IFoto['blob']>;
  blobContentType: FormControl<IFoto['blobContentType']>;
  nome_file: FormControl<IFoto['nome_file']>;
  concerto: FormControl<IFoto['concerto']>;
};

export type FotoFormGroup = FormGroup<FotoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FotoFormService {
  createFotoFormGroup(foto: FotoFormGroupInput = { id: null }): FotoFormGroup {
    const fotoRawValue = {
      ...this.getFormDefaults(),
      ...foto,
    };
    return new FormGroup<FotoFormGroupContent>({
      id: new FormControl(
        { value: fotoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      blob: new FormControl(fotoRawValue.blob),
      blobContentType: new FormControl(fotoRawValue.blobContentType),
      nome_file: new FormControl(fotoRawValue.nome_file),
      concerto: new FormControl(fotoRawValue.concerto),
    });
  }

  getFoto(form: FotoFormGroup): IFoto | NewFoto {
    return form.getRawValue() as IFoto | NewFoto;
  }

  resetForm(form: FotoFormGroup, foto: FotoFormGroupInput): void {
    const fotoRawValue = { ...this.getFormDefaults(), ...foto };
    form.reset(
      {
        ...fotoRawValue,
        id: { value: fotoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FotoFormDefaults {
    return {
      id: null,
    };
  }
}
