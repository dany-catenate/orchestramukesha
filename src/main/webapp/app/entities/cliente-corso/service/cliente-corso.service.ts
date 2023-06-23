import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClienteCorso, NewClienteCorso } from '../cliente-corso.model';

export type PartialUpdateClienteCorso = Partial<IClienteCorso> & Pick<IClienteCorso, 'id'>;

export type EntityResponseType = HttpResponse<IClienteCorso>;
export type EntityArrayResponseType = HttpResponse<IClienteCorso[]>;

@Injectable({ providedIn: 'root' })
export class ClienteCorsoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cliente-corsos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clienteCorso: NewClienteCorso): Observable<EntityResponseType> {
    return this.http.post<IClienteCorso>(this.resourceUrl, clienteCorso, { observe: 'response' });
  }

  update(clienteCorso: IClienteCorso): Observable<EntityResponseType> {
    return this.http.put<IClienteCorso>(`${this.resourceUrl}/${this.getClienteCorsoIdentifier(clienteCorso)}`, clienteCorso, {
      observe: 'response',
    });
  }

  partialUpdate(clienteCorso: PartialUpdateClienteCorso): Observable<EntityResponseType> {
    return this.http.patch<IClienteCorso>(`${this.resourceUrl}/${this.getClienteCorsoIdentifier(clienteCorso)}`, clienteCorso, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClienteCorso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClienteCorso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClienteCorsoIdentifier(clienteCorso: Pick<IClienteCorso, 'id'>): number {
    return clienteCorso.id;
  }

  compareClienteCorso(o1: Pick<IClienteCorso, 'id'> | null, o2: Pick<IClienteCorso, 'id'> | null): boolean {
    return o1 && o2 ? this.getClienteCorsoIdentifier(o1) === this.getClienteCorsoIdentifier(o2) : o1 === o2;
  }

  addClienteCorsoToCollectionIfMissing<Type extends Pick<IClienteCorso, 'id'>>(
    clienteCorsoCollection: Type[],
    ...clienteCorsosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clienteCorsos: Type[] = clienteCorsosToCheck.filter(isPresent);
    if (clienteCorsos.length > 0) {
      const clienteCorsoCollectionIdentifiers = clienteCorsoCollection.map(
        clienteCorsoItem => this.getClienteCorsoIdentifier(clienteCorsoItem)!
      );
      const clienteCorsosToAdd = clienteCorsos.filter(clienteCorsoItem => {
        const clienteCorsoIdentifier = this.getClienteCorsoIdentifier(clienteCorsoItem);
        if (clienteCorsoCollectionIdentifiers.includes(clienteCorsoIdentifier)) {
          return false;
        }
        clienteCorsoCollectionIdentifiers.push(clienteCorsoIdentifier);
        return true;
      });
      return [...clienteCorsosToAdd, ...clienteCorsoCollection];
    }
    return clienteCorsoCollection;
  }
}
