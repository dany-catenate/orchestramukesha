import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FilmatoFormService } from './filmato-form.service';
import { FilmatoService } from '../service/filmato.service';
import { IFilmato } from '../filmato.model';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

import { FilmatoUpdateComponent } from './filmato-update.component';

describe('Filmato Management Update Component', () => {
  let comp: FilmatoUpdateComponent;
  let fixture: ComponentFixture<FilmatoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let filmatoFormService: FilmatoFormService;
  let filmatoService: FilmatoService;
  let concertoService: ConcertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FilmatoUpdateComponent],
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
      .overrideTemplate(FilmatoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FilmatoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    filmatoFormService = TestBed.inject(FilmatoFormService);
    filmatoService = TestBed.inject(FilmatoService);
    concertoService = TestBed.inject(ConcertoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Concerto query and add missing value', () => {
      const filmato: IFilmato = { id: 456 };
      const concerto: IConcerto = { id: 99909 };
      filmato.concerto = concerto;

      const concertoCollection: IConcerto[] = [{ id: 54636 }];
      jest.spyOn(concertoService, 'query').mockReturnValue(of(new HttpResponse({ body: concertoCollection })));
      const additionalConcertos = [concerto];
      const expectedCollection: IConcerto[] = [...additionalConcertos, ...concertoCollection];
      jest.spyOn(concertoService, 'addConcertoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ filmato });
      comp.ngOnInit();

      expect(concertoService.query).toHaveBeenCalled();
      expect(concertoService.addConcertoToCollectionIfMissing).toHaveBeenCalledWith(
        concertoCollection,
        ...additionalConcertos.map(expect.objectContaining)
      );
      expect(comp.concertosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const filmato: IFilmato = { id: 456 };
      const concerto: IConcerto = { id: 37571 };
      filmato.concerto = concerto;

      activatedRoute.data = of({ filmato });
      comp.ngOnInit();

      expect(comp.concertosSharedCollection).toContain(concerto);
      expect(comp.filmato).toEqual(filmato);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFilmato>>();
      const filmato = { id: 123 };
      jest.spyOn(filmatoFormService, 'getFilmato').mockReturnValue(filmato);
      jest.spyOn(filmatoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filmato });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filmato }));
      saveSubject.complete();

      // THEN
      expect(filmatoFormService.getFilmato).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(filmatoService.update).toHaveBeenCalledWith(expect.objectContaining(filmato));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFilmato>>();
      const filmato = { id: 123 };
      jest.spyOn(filmatoFormService, 'getFilmato').mockReturnValue({ id: null });
      jest.spyOn(filmatoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filmato: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filmato }));
      saveSubject.complete();

      // THEN
      expect(filmatoFormService.getFilmato).toHaveBeenCalled();
      expect(filmatoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFilmato>>();
      const filmato = { id: 123 };
      jest.spyOn(filmatoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filmato });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(filmatoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareConcerto', () => {
      it('Should forward to concertoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(concertoService, 'compareConcerto');
        comp.compareConcerto(entity, entity2);
        expect(concertoService.compareConcerto).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
