import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICorso } from '../corso.model';
import { CorsoService } from '../service/corso.service';

export const corsoResolve = (route: ActivatedRouteSnapshot): Observable<null | ICorso> => {
  const id = route.params['id'];
  if (id) {
    return inject(CorsoService)
      .find(id)
      .pipe(
        mergeMap((corso: HttpResponse<ICorso>) => {
          if (corso.body) {
            return of(corso.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default corsoResolve;
