jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ClienteCorsoService } from '../service/cliente-corso.service';

import { ClienteCorsoDeleteDialogComponent } from './cliente-corso-delete-dialog.component';

describe('ClienteCorso Management Delete Component', () => {
  let comp: ClienteCorsoDeleteDialogComponent;
  let fixture: ComponentFixture<ClienteCorsoDeleteDialogComponent>;
  let service: ClienteCorsoService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClienteCorsoDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ClienteCorsoDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClienteCorsoDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClienteCorsoService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
