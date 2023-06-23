import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConcertoFormService } from './concerto-form.service';
import { ConcertoService } from '../service/concerto.service';
import { IConcerto } from '../concerto.model';
import { ICorso } from 'app/entities/corso/corso.model';
import { CorsoService } from 'app/entities/corso/service/corso.service';

import { ConcertoUpdateComponent } from './concerto-update.component';

describe('Concerto Management Update Component', () => {
  let comp: ConcertoUpdateComponent;
  let fixture: ComponentFixture<ConcertoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let concertoFormService: ConcertoFormService;
  let concertoService: ConcertoService;
  let corsoService: CorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ConcertoUpdateComponent],
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
      .overrideTemplate(ConcertoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConcertoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    concertoFormService = TestBed.inject(ConcertoFormService);
    concertoService = TestBed.inject(ConcertoService);
    corsoService = TestBed.inject(CorsoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Corso query and add missing value', () => {
      const concerto: IConcerto = { id: 456 };
      const corso: ICorso = { id: 42052 };
      concerto.corso = corso;

      const corsoCollection: ICorso[] = [{ id: 67628 }];
      jest.spyOn(corsoService, 'query').mockReturnValue(of(new HttpResponse({ body: corsoCollection })));
      const additionalCorsos = [corso];
      const expectedCollection: ICorso[] = [...additionalCorsos, ...corsoCollection];
      jest.spyOn(corsoService, 'addCorsoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ concerto });
      comp.ngOnInit();

      expect(corsoService.query).toHaveBeenCalled();
      expect(corsoService.addCorsoToCollectionIfMissing).toHaveBeenCalledWith(
        corsoCollection,
        ...additionalCorsos.map(expect.objectContaining)
      );
      expect(comp.corsosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const concerto: IConcerto = { id: 456 };
      const corso: ICorso = { id: 86745 };
      concerto.corso = corso;

      activatedRoute.data = of({ concerto });
      comp.ngOnInit();

      expect(comp.corsosSharedCollection).toContain(corso);
      expect(comp.concerto).toEqual(concerto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcerto>>();
      const concerto = { id: 123 };
      jest.spyOn(concertoFormService, 'getConcerto').mockReturnValue(concerto);
      jest.spyOn(concertoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concerto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concerto }));
      saveSubject.complete();

      // THEN
      expect(concertoFormService.getConcerto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(concertoService.update).toHaveBeenCalledWith(expect.objectContaining(concerto));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcerto>>();
      const concerto = { id: 123 };
      jest.spyOn(concertoFormService, 'getConcerto').mockReturnValue({ id: null });
      jest.spyOn(concertoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concerto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concerto }));
      saveSubject.complete();

      // THEN
      expect(concertoFormService.getConcerto).toHaveBeenCalled();
      expect(concertoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcerto>>();
      const concerto = { id: 123 };
      jest.spyOn(concertoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concerto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(concertoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCorso', () => {
      it('Should forward to corsoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(corsoService, 'compareCorso');
        comp.compareCorso(entity, entity2);
        expect(corsoService.compareCorso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
