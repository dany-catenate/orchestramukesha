import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFilmato } from '../filmato.model';
import { FilmatoService } from '../service/filmato.service';

export const filmatoResolve = (route: ActivatedRouteSnapshot): Observable<null | IFilmato> => {
  const id = route.params['id'];
  if (id) {
    return inject(FilmatoService)
      .find(id)
      .pipe(
        mergeMap((filmato: HttpResponse<IFilmato>) => {
          if (filmato.body) {
            return of(filmato.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default filmatoResolve;
