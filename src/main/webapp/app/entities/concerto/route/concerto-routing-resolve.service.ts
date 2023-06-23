import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConcerto } from '../concerto.model';
import { ConcertoService } from '../service/concerto.service';

export const concertoResolve = (route: ActivatedRouteSnapshot): Observable<null | IConcerto> => {
  const id = route.params['id'];
  if (id) {
    return inject(ConcertoService)
      .find(id)
      .pipe(
        mergeMap((concerto: HttpResponse<IConcerto>) => {
          if (concerto.body) {
            return of(concerto.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default concertoResolve;
