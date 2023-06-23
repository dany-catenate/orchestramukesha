import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IFilmato } from '../filmato.model';
import { FilmatoService } from '../service/filmato.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './filmato-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FilmatoDeleteDialogComponent {
  filmato?: IFilmato;

  constructor(protected filmatoService: FilmatoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.filmatoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
