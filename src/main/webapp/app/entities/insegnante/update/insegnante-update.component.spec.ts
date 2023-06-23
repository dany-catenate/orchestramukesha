import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InsegnanteFormService } from './insegnante-form.service';
import { InsegnanteService } from '../service/insegnante.service';
import { IInsegnante } from '../insegnante.model';

import { InsegnanteUpdateComponent } from './insegnante-update.component';

describe('Insegnante Management Update Component', () => {
  let comp: InsegnanteUpdateComponent;
  let fixture: ComponentFixture<InsegnanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let insegnanteFormService: InsegnanteFormService;
  let insegnanteService: InsegnanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InsegnanteUpdateComponent],
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
      .overrideTemplate(InsegnanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsegnanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    insegnanteFormService = TestBed.inject(InsegnanteFormService);
    insegnanteService = TestBed.inject(InsegnanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const insegnante: IInsegnante = { id: 456 };

      activatedRoute.data = of({ insegnante });
      comp.ngOnInit();

      expect(comp.insegnante).toEqual(insegnante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnante>>();
      const insegnante = { id: 123 };
      jest.spyOn(insegnanteFormService, 'getInsegnante').mockReturnValue(insegnante);
      jest.spyOn(insegnanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insegnante }));
      saveSubject.complete();

      // THEN
      expect(insegnanteFormService.getInsegnante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(insegnanteService.update).toHaveBeenCalledWith(expect.objectContaining(insegnante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnante>>();
      const insegnante = { id: 123 };
      jest.spyOn(insegnanteFormService, 'getInsegnante').mockReturnValue({ id: null });
      jest.spyOn(insegnanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insegnante }));
      saveSubject.complete();

      // THEN
      expect(insegnanteFormService.getInsegnante).toHaveBeenCalled();
      expect(insegnanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnante>>();
      const insegnante = { id: 123 };
      jest.spyOn(insegnanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(insegnanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
