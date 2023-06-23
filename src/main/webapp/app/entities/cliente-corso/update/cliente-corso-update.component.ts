import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClienteCorsoFormService, ClienteCorsoFormGroup } from './cliente-corso-form.service';
import { IClienteCorso } from '../cliente-corso.model';
import { ClienteCorsoService } from '../service/cliente-corso.service';

@Component({
  standalone: true,
  selector: 'jhi-cliente-corso-update',
  templateUrl: './cliente-corso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClienteCorsoUpdateComponent implements OnInit {
  isSaving = false;
  clienteCorso: IClienteCorso | null = null;

  editForm: ClienteCorsoFormGroup = this.clienteCorsoFormService.createClienteCorsoFormGroup();

  constructor(
    protected clienteCorsoService: ClienteCorsoService,
    protected clienteCorsoFormService: ClienteCorsoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clienteCorso }) => {
      this.clienteCorso = clienteCorso;
      if (clienteCorso) {
        this.updateForm(clienteCorso);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clienteCorso = this.clienteCorsoFormService.getClienteCorso(this.editForm);
    if (clienteCorso.id !== null) {
      this.subscribeToSaveResponse(this.clienteCorsoService.update(clienteCorso));
    } else {
      this.subscribeToSaveResponse(this.clienteCorsoService.create(clienteCorso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClienteCorso>>): void {
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

  protected updateForm(clienteCorso: IClienteCorso): void {
    this.clienteCorso = clienteCorso;
    this.clienteCorsoFormService.resetForm(this.editForm, clienteCorso);
  }
}
