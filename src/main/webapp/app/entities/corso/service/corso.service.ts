import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICorso, NewCorso } from '../corso.model';

export type PartialUpdateCorso = Partial<ICorso> & Pick<ICorso, 'id'>;

export type EntityResponseType = HttpResponse<ICorso>;
export type EntityArrayResponseType = HttpResponse<ICorso[]>;

@Injectable({ providedIn: 'root' })
export class CorsoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/corsos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(corso: NewCorso): Observable<EntityResponseType> {
    return this.http.post<ICorso>(this.resourceUrl, corso, { observe: 'response' });
  }

  update(corso: ICorso): Observable<EntityResponseType> {
    return this.http.put<ICorso>(`${this.resourceUrl}/${this.getCorsoIdentifier(corso)}`, corso, { observe: 'response' });
  }

  partialUpdate(corso: PartialUpdateCorso): Observable<EntityResponseType> {
    return this.http.patch<ICorso>(`${this.resourceUrl}/${this.getCorsoIdentifier(corso)}`, corso, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICorso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICorso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCorsoIdentifier(corso: Pick<ICorso, 'id'>): number {
    return corso.id;
  }

  compareCorso(o1: Pick<ICorso, 'id'> | null, o2: Pick<ICorso, 'id'> | null): boolean {
    return o1 && o2 ? this.getCorsoIdentifier(o1) === this.getCorsoIdentifier(o2) : o1 === o2;
  }

  addCorsoToCollectionIfMissing<Type extends Pick<ICorso, 'id'>>(
    corsoCollection: Type[],
    ...corsosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const corsos: Type[] = corsosToCheck.filter(isPresent);
    if (corsos.length > 0) {
      const corsoCollectionIdentifiers = corsoCollection.map(corsoItem => this.getCorsoIdentifier(corsoItem)!);
      const corsosToAdd = corsos.filter(corsoItem => {
        const corsoIdentifier = this.getCorsoIdentifier(corsoItem);
        if (corsoCollectionIdentifiers.includes(corsoIdentifier)) {
          return false;
        }
        corsoCollectionIdentifiers.push(corsoIdentifier);
        return true;
      });
      return [...corsosToAdd, ...corsoCollection];
    }
    return corsoCollection;
  }
}
