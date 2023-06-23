import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IConcerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './concerto-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConcertoDeleteDialogComponent {
  concerto?: IConcerto;

  constructor(protected concertoService: ConcertoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.concertoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
