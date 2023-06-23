import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IClienteCorso } from '../cliente-corso.model';
import { ClienteCorsoService } from '../service/cliente-corso.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './cliente-corso-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClienteCorsoDeleteDialogComponent {
  clienteCorso?: IClienteCorso;

  constructor(protected clienteCorsoService: ClienteCorsoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clienteCorsoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
