import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CorsoFormService } from './corso-form.service';
import { CorsoService } from '../service/corso.service';
import { ICorso } from '../corso.model';

import { CorsoUpdateComponent } from './corso-update.component';

describe('Corso Management Update Component', () => {
  let comp: CorsoUpdateComponent;
  let fixture: ComponentFixture<CorsoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let corsoFormService: CorsoFormService;
  let corsoService: CorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CorsoUpdateComponent],
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
      .overrideTemplate(CorsoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CorsoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    corsoFormService = TestBed.inject(CorsoFormService);
    corsoService = TestBed.inject(CorsoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const corso: ICorso = { id: 456 };

      activatedRoute.data = of({ corso });
      comp.ngOnInit();

      expect(comp.corso).toEqual(corso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICorso>>();
      const corso = { id: 123 };
      jest.spyOn(corsoFormService, 'getCorso').mockReturnValue(corso);
      jest.spyOn(corsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: corso }));
      saveSubject.complete();

      // THEN
      expect(corsoFormService.getCorso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(corsoService.update).toHaveBeenCalledWith(expect.objectContaining(corso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICorso>>();
      const corso = { id: 123 };
      jest.spyOn(corsoFormService, 'getCorso').mockReturnValue({ id: null });
      jest.spyOn(corsoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: corso }));
      saveSubject.complete();

      // THEN
      expect(corsoFormService.getCorso).toHaveBeenCalled();
      expect(corsoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICorso>>();
      const corso = { id: 123 };
      jest.spyOn(corsoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(corsoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
