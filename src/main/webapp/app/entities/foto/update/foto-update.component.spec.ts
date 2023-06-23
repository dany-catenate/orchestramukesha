import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FotoFormService } from './foto-form.service';
import { FotoService } from '../service/foto.service';
import { IFoto } from '../foto.model';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

import { FotoUpdateComponent } from './foto-update.component';

describe('Foto Management Update Component', () => {
  let comp: FotoUpdateComponent;
  let fixture: ComponentFixture<FotoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fotoFormService: FotoFormService;
  let fotoService: FotoService;
  let concertoService: ConcertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FotoUpdateComponent],
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
      .overrideTemplate(FotoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FotoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fotoFormService = TestBed.inject(FotoFormService);
    fotoService = TestBed.inject(FotoService);
    concertoService = TestBed.inject(ConcertoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Concerto query and add missing value', () => {
      const foto: IFoto = { id: 456 };
      const concerto: IConcerto = { id: 9111 };
      foto.concerto = concerto;

      const concertoCollection: IConcerto[] = [{ id: 2140 }];
      jest.spyOn(concertoService, 'query').mockReturnValue(of(new HttpResponse({ body: concertoCollection })));
      const additionalConcertos = [concerto];
      const expectedCollection: IConcerto[] = [...additionalConcertos, ...concertoCollection];
      jest.spyOn(concertoService, 'addConcertoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ foto });
      comp.ngOnInit();

      expect(concertoService.query).toHaveBeenCalled();
      expect(concertoService.addConcertoToCollectionIfMissing).toHaveBeenCalledWith(
        concertoCollection,
        ...additionalConcertos.map(expect.objectContaining)
      );
      expect(comp.concertosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const foto: IFoto = { id: 456 };
      const concerto: IConcerto = { id: 76461 };
      foto.concerto = concerto;

      activatedRoute.data = of({ foto });
      comp.ngOnInit();

      expect(comp.concertosSharedCollection).toContain(concerto);
      expect(comp.foto).toEqual(foto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFoto>>();
      const foto = { id: 123 };
      jest.spyOn(fotoFormService, 'getFoto').mockReturnValue(foto);
      jest.spyOn(fotoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foto }));
      saveSubject.complete();

      // THEN
      expect(fotoFormService.getFoto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fotoService.update).toHaveBeenCalledWith(expect.objectContaining(foto));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFoto>>();
      const foto = { id: 123 };
      jest.spyOn(fotoFormService, 'getFoto').mockReturnValue({ id: null });
      jest.spyOn(fotoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foto }));
      saveSubject.complete();

      // THEN
      expect(fotoFormService.getFoto).toHaveBeenCalled();
      expect(fotoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFoto>>();
      const foto = { id: 123 };
      jest.spyOn(fotoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fotoService.update).toHaveBeenCalled();
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
