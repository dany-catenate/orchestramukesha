import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InsegnanteCorsoFormService } from './insegnante-corso-form.service';
import { InsegnanteCorsoService } from '../service/insegnante-corso.service';
import { IInsegnanteCorso } from '../insegnante-corso.model';

import { InsegnanteCorsoUpdateComponent } from './insegnante-corso-update.component';

describe('InsegnanteCorso Management Update Component', () => {
  let comp: InsegnanteCorsoUpdateComponent;
  let fixture: ComponentFixture<InsegnanteCorsoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let insegnanteCorsoFormService: InsegnanteCorsoFormService;
  let insegnanteCorsoService: InsegnanteCorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InsegnanteCorsoUpdateComponent],
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
      .overrideTemplate(InsegnanteCorsoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsegnanteCorsoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    insegnanteCorsoFormService = TestBed.inject(InsegnanteCorsoFormService);
    insegnanteCorsoService = TestBed.inject(InsegnanteCorsoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const insegnanteCorso: IInsegnanteCorso = { id: 456 };

      activatedRoute.data = of({ insegnanteCorso });
      comp.ngOnInit();

      expect(comp.insegnanteCorso).toEqual(insegnanteCorso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnanteCorso>>();
      const insegnanteCorso = { id: 123 };
      jest.spyOn(insegnanteCorsoFormService, 'getInsegnanteCorso').mockReturnValue(insegnanteCorso);
      jest.spyOn(insegnanteCorsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnanteCorso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insegnanteCorso }));
      saveSubject.complete();

      // THEN
      expect(insegnanteCorsoFormService.getInsegnanteCorso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(insegnanteCorsoService.update).toHaveBeenCalledWith(expect.objectContaining(insegnanteCorso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnanteCorso>>();
      const insegnanteCorso = { id: 123 };
      jest.spyOn(insegnanteCorsoFormService, 'getInsegnanteCorso').mockReturnValue({ id: null });
      jest.spyOn(insegnanteCorsoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnanteCorso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insegnanteCorso }));
      saveSubject.complete();

      // THEN
      expect(insegnanteCorsoFormService.getInsegnanteCorso).toHaveBeenCalled();
      expect(insegnanteCorsoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsegnanteCorso>>();
      const insegnanteCorso = { id: 123 };
      jest.spyOn(insegnanteCorsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insegnanteCorso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(insegnanteCorsoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
