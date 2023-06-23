import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IInsegnanteCorso } from '../insegnante-corso.model';
import { InsegnanteCorsoService } from '../service/insegnante-corso.service';

import insegnanteCorsoResolve from './insegnante-corso-routing-resolve.service';

describe('InsegnanteCorso routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: InsegnanteCorsoService;
  let resultInsegnanteCorso: IInsegnanteCorso | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(InsegnanteCorsoService);
    resultInsegnanteCorso = undefined;
  });

  describe('resolve', () => {
    it('should return IInsegnanteCorso returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        insegnanteCorsoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInsegnanteCorso = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInsegnanteCorso).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        insegnanteCorsoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInsegnanteCorso = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultInsegnanteCorso).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IInsegnanteCorso>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        insegnanteCorsoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInsegnanteCorso = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInsegnanteCorso).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});