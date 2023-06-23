import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClienteCorsoFormService } from './cliente-corso-form.service';
import { ClienteCorsoService } from '../service/cliente-corso.service';
import { IClienteCorso } from '../cliente-corso.model';

import { ClienteCorsoUpdateComponent } from './cliente-corso-update.component';

describe('ClienteCorso Management Update Component', () => {
  let comp: ClienteCorsoUpdateComponent;
  let fixture: ComponentFixture<ClienteCorsoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clienteCorsoFormService: ClienteCorsoFormService;
  let clienteCorsoService: ClienteCorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ClienteCorsoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ClienteCorsoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClienteCorsoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clienteCorsoFormService = TestBed.inject(ClienteCorsoFormService);
    clienteCorsoService = TestBed.inject(ClienteCorsoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const clienteCorso: IClienteCorso = { id: 456 };

      activatedRoute.data = of({ clienteCorso });
      comp.ngOnInit();

      expect(comp.clienteCorso).toEqual(clienteCorso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClienteCorso>>();
      const clienteCorso = { id: 123 };
      jest.spyOn(clienteCorsoFormService, 'getClienteCorso').mockReturnValue(clienteCorso);
      jest.spyOn(clienteCorsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clienteCorso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clienteCorso }));
      saveSubject.complete();

      // THEN
      expect(clienteCorsoFormService.getClienteCorso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clienteCorsoService.update).toHaveBeenCalledWith(expect.objectContaining(clienteCorso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClienteCorso>>();
      const clienteCorso = { id: 123 };
      jest.spyOn(clienteCorsoFormService, 'getClienteCorso').mockReturnValue({ id: null });
      jest.spyOn(clienteCorsoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clienteCorso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clienteCorso }));
      saveSubject.complete();

      // THEN
      expect(clienteCorsoFormService.getClienteCorso).toHaveBeenCalled();
      expect(clienteCorsoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClienteCorso>>();
      const clienteCorso = { id: 123 };
      jest.spyOn(clienteCorsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clienteCorso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clienteCorsoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
