import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InsegnanteFormService, InsegnanteFormGroup } from './insegnante-form.service';
import { IInsegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';

@Component({
  standalone: true,
  selector: 'jhi-insegnante-update',
  templateUrl: './insegnante-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InsegnanteUpdateComponent implements OnInit {
  isSaving = false;
  insegnante: IInsegnante | null = null;

  editForm: InsegnanteFormGroup = this.insegnanteFormService.createInsegnanteFormGroup();

  constructor(
    protected insegnanteService: InsegnanteService,
    protected insegnanteFormService: InsegnanteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insegnante }) => {
      this.insegnante = insegnante;
      if (insegnante) {
        this.updateForm(insegnante);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const insegnante = this.insegnanteFormService.getInsegnante(this.editForm);
    if (insegnante.id !== null) {
      this.subscribeToSaveResponse(this.insegnanteService.update(insegnante));
    } else {
      this.subscribeToSaveResponse(this.insegnanteService.create(insegnante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInsegnante>>): void {
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

  protected updateForm(insegnante: IInsegnante): void {
    this.insegnante = insegnante;
    this.insegnanteFormService.resetForm(this.editForm, insegnante);
  }
}
