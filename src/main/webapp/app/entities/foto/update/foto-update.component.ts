import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FotoFormService, FotoFormGroup } from './foto-form.service';
import { IFoto } from '../foto.model';
import { FotoService } from '../service/foto.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

@Component({
  standalone: true,
  selector: 'jhi-foto-update',
  templateUrl: './foto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FotoUpdateComponent implements OnInit {
  isSaving = false;
  foto: IFoto | null = null;

  concertosSharedCollection: IConcerto[] = [];

  editForm: FotoFormGroup = this.fotoFormService.createFotoFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fotoService: FotoService,
    protected fotoFormService: FotoFormService,
    protected concertoService: ConcertoService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConcerto = (o1: IConcerto | null, o2: IConcerto | null): boolean => this.concertoService.compareConcerto(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foto }) => {
      this.foto = foto;
      if (foto) {
        this.updateForm(foto);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('orchestraApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foto = this.fotoFormService.getFoto(this.editForm);
    if (foto.id !== null) {
      this.subscribeToSaveResponse(this.fotoService.update(foto));
    } else {
      this.subscribeToSaveResponse(this.fotoService.create(foto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(foto: IFoto): void {
    this.foto = foto;
    this.fotoFormService.resetForm(this.editForm, foto);

    this.concertosSharedCollection = this.concertoService.addConcertoToCollectionIfMissing<IConcerto>(
      this.concertosSharedCollection,
      foto.concerto
    );
  }

  protected loadRelationshipsOptions(): void {
    this.concertoService
      .query()
      .pipe(map((res: HttpResponse<IConcerto[]>) => res.body ?? []))
      .pipe(
        map((concertos: IConcerto[]) => this.concertoService.addConcertoToCollectionIfMissing<IConcerto>(concertos, this.foto?.concerto))
      )
      .subscribe((concertos: IConcerto[]) => (this.concertosSharedCollection = concertos));
  }
}
