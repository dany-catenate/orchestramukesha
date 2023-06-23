import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFoto } from '../foto.model';
import { FotoService } from '../service/foto.service';

export const fotoResolve = (route: ActivatedRouteSnapshot): Observable<null | IFoto> => {
  const id = route.params['id'];
  if (id) {
    return inject(FotoService)
      .find(id)
      .pipe(
        mergeMap((foto: HttpResponse<IFoto>) => {
          if (foto.body) {
            return of(foto.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default fotoResolve;
