import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInsegnanteCorso } from '../insegnante-corso.model';
import { InsegnanteCorsoService } from '../service/insegnante-corso.service';

export const insegnanteCorsoResolve = (route: ActivatedRouteSnapshot): Observable<null | IInsegnanteCorso> => {
  const id = route.params['id'];
  if (id) {
    return inject(InsegnanteCorsoService)
      .find(id)
      .pipe(
        mergeMap((insegnanteCorso: HttpResponse<IInsegnanteCorso>) => {
          if (insegnanteCorso.body) {
            return of(insegnanteCorso.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default insegnanteCorsoResolve;
