import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CorsoFormService, CorsoFormGroup } from './corso-form.service';
import { ICorso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

@Component({
  standalone: true,
  selector: 'jhi-corso-update',
  templateUrl: './corso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CorsoUpdateComponent implements OnInit {
  isSaving = false;
  corso: ICorso | null = null;

  editForm: CorsoFormGroup = this.corsoFormService.createCorsoFormGroup();

  constructor(
    protected corsoService: CorsoService,
    protected corsoFormService: CorsoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ corso }) => {
      this.corso = corso;
      if (corso) {
        this.updateForm(corso);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const corso = this.corsoFormService.getCorso(this.editForm);
    if (corso.id !== null) {
      this.subscribeToSaveResponse(this.corsoService.update(corso));
    } else {
      this.subscribeToSaveResponse(this.corsoService.create(corso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICorso>>): void {
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

  protected updateForm(corso: ICorso): void {
    this.corso = corso;
    this.corsoFormService.resetForm(this.editForm, corso);
  }
}
