import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInsegnante } from '../insegnante.model';
import { InsegnanteService } from '../service/insegnante.service';

export const insegnanteResolve = (route: ActivatedRouteSnapshot): Observable<null | IInsegnante> => {
  const id = route.params['id'];
  if (id) {
    return inject(InsegnanteService)
      .find(id)
      .pipe(
        mergeMap((insegnante: HttpResponse<IInsegnante>) => {
          if (insegnante.body) {
            return of(insegnante.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default insegnanteResolve;
