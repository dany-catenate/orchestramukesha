import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IInsegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './insegnante-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InsegnanteDeleteDialogComponent {
  insegnante?: IInsegnante;

  constructor(protected insegnanteService: InsegnanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.insegnanteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
