import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InsegnanteCorsoFormService, InsegnanteCorsoFormGroup } from './insegnante-corso-form.service';
import { IInsegnanteCorso } from '../insegnante-corso.model';
import { InsegnanteCorsoService } from '../service/insegnante-corso.service';

@Component({
  standalone: true,
  selector: 'jhi-insegnante-corso-update',
  templateUrl: './insegnante-corso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InsegnanteCorsoUpdateComponent implements OnInit {
  isSaving = false;
  insegnanteCorso: IInsegnanteCorso | null = null;

  editForm: InsegnanteCorsoFormGroup = this.insegnanteCorsoFormService.createInsegnanteCorsoFormGroup();

  constructor(
    protected insegnanteCorsoService: InsegnanteCorsoService,
    protected insegnanteCorsoFormService: InsegnanteCorsoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insegnanteCorso }) => {
      this.insegnanteCorso = insegnanteCorso;
      if (insegnanteCorso) {
        this.updateForm(insegnanteCorso);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const insegnanteCorso = this.insegnanteCorsoFormService.getInsegnanteCorso(this.editForm);
    if (insegnanteCorso.id !== null) {
      this.subscribeToSaveResponse(this.insegnanteCorsoService.update(insegnanteCorso));
    } else {
      this.subscribeToSaveResponse(this.insegnanteCorsoService.create(insegnanteCorso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInsegnanteCorso>>): void {
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

  protected updateForm(insegnanteCorso: IInsegnanteCorso): void {
    this.insegnanteCorso = insegnanteCorso;
    this.insegnanteCorsoFormService.resetForm(this.editForm, insegnanteCorso);
  }
}
