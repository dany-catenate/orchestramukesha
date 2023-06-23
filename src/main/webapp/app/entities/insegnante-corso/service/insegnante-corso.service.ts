import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInsegnanteCorso, NewInsegnanteCorso } from '../insegnante-corso.model';

export type PartialUpdateInsegnanteCorso = Partial<IInsegnanteCorso> & Pick<IInsegnanteCorso, 'id'>;

export type EntityResponseType = HttpResponse<IInsegnanteCorso>;
export type EntityArrayResponseType = HttpResponse<IInsegnanteCorso[]>;

@Injectable({ providedIn: 'root' })
export class InsegnanteCorsoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/insegnante-corsos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(insegnanteCorso: NewInsegnanteCorso): Observable<EntityResponseType> {
    return this.http.post<IInsegnanteCorso>(this.resourceUrl, insegnanteCorso, { observe: 'response' });
  }

  update(insegnanteCorso: IInsegnanteCorso): Observable<EntityResponseType> {
    return this.http.put<IInsegnanteCorso>(`${this.resourceUrl}/${this.getInsegnanteCorsoIdentifier(insegnanteCorso)}`, insegnanteCorso, {
      observe: 'response',
    });
  }

  partialUpdate(insegnanteCorso: PartialUpdateInsegnanteCorso): Observable<EntityResponseType> {
    return this.http.patch<IInsegnanteCorso>(`${this.resourceUrl}/${this.getInsegnanteCorsoIdentifier(insegnanteCorso)}`, insegnanteCorso, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInsegnanteCorso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInsegnanteCorso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInsegnanteCorsoIdentifier(insegnanteCorso: Pick<IInsegnanteCorso, 'id'>): number {
    return insegnanteCorso.id;
  }

  compareInsegnanteCorso(o1: Pick<IInsegnanteCorso, 'id'> | null, o2: Pick<IInsegnanteCorso, 'id'> | null): boolean {
    return o1 && o2 ? this.getInsegnanteCorsoIdentifier(o1) === this.getInsegnanteCorsoIdentifier(o2) : o1 === o2;
  }

  addInsegnanteCorsoToCollectionIfMissing<Type extends Pick<IInsegnanteCorso, 'id'>>(
    insegnanteCorsoCollection: Type[],
    ...insegnanteCorsosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const insegnanteCorsos: Type[] = insegnanteCorsosToCheck.filter(isPresent);
    if (insegnanteCorsos.length > 0) {
      const insegnanteCorsoCollectionIdentifiers = insegnanteCorsoCollection.map(
        insegnanteCorsoItem => this.getInsegnanteCorsoIdentifier(insegnanteCorsoItem)!
      );
      const insegnanteCorsosToAdd = insegnanteCorsos.filter(insegnanteCorsoItem => {
        const insegnanteCorsoIdentifier = this.getInsegnanteCorsoIdentifier(insegnanteCorsoItem);
        if (insegnanteCorsoCollectionIdentifiers.includes(insegnanteCorsoIdentifier)) {
          return false;
        }
        insegnanteCorsoCollectionIdentifiers.push(insegnanteCorsoIdentifier);
        return true;
      });
      return [...insegnanteCorsosToAdd, ...insegnanteCorsoCollection];
    }
    return insegnanteCorsoCollection;
  }
}
