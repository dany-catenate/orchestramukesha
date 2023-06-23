import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClienteCorso } from '../cliente-corso.model';
import { ClienteCorsoService } from '../service/cliente-corso.service';

export const clienteCorsoResolve = (route: ActivatedRouteSnapshot): Observable<null | IClienteCorso> => {
  const id = route.params['id'];
  if (id) {
    return inject(ClienteCorsoService)
      .find(id)
      .pipe(
        mergeMap((clienteCorso: HttpResponse<IClienteCorso>) => {
          if (clienteCorso.body) {
            return of(clienteCorso.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default clienteCorsoResolve;
