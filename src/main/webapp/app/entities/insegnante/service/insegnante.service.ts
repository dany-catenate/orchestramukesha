import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInsegnante, NewInsegnante } from '../insegnante.model';

export type PartialUpdateInsegnante = Partial<IInsegnante> & Pick<IInsegnante, 'id'>;

export type EntityResponseType = HttpResponse<IInsegnante>;
export type EntityArrayResponseType = HttpResponse<IInsegnante[]>;

@Injectable({ providedIn: 'root' })
export class InsegnanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/insegnantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(insegnante: NewInsegnante): Observable<EntityResponseType> {
    return this.http.post<IInsegnante>(this.resourceUrl, insegnante, { observe: 'response' });
  }

  update(insegnante: IInsegnante): Observable<EntityResponseType> {
    return this.http.put<IInsegnante>(`${this.resourceUrl}/${this.getInsegnanteIdentifier(insegnante)}`, insegnante, {
      observe: 'response',
    });
  }

  partialUpdate(insegnante: PartialUpdateInsegnante): Observable<EntityResponseType> {
    return this.http.patch<IInsegnante>(`${this.resourceUrl}/${this.getInsegnanteIdentifier(insegnante)}`, insegnante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInsegnante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInsegnante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInsegnanteIdentifier(insegnante: Pick<IInsegnante, 'id'>): number {
    return insegnante.id;
  }

  compareInsegnante(o1: Pick<IInsegnante, 'id'> | null, o2: Pick<IInsegnante, 'id'> | null): boolean {
    return o1 && o2 ? this.getInsegnanteIdentifier(o1) === this.getInsegnanteIdentifier(o2) : o1 === o2;
  }

  addInsegnanteToCollectionIfMissing<Type extends Pick<IInsegnante, 'id'>>(
    insegnanteCollection: Type[],
    ...insegnantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const insegnantes: Type[] = insegnantesToCheck.filter(isPresent);
    if (insegnantes.length > 0) {
      const insegnanteCollectionIdentifiers = insegnanteCollection.map(insegnanteItem => this.getInsegnanteIdentifier(insegnanteItem)!);
      const insegnantesToAdd = insegnantes.filter(insegnanteItem => {
        const insegnanteIdentifier = this.getInsegnanteIdentifier(insegnanteItem);
        if (insegnanteCollectionIdentifiers.includes(insegnanteIdentifier)) {
          return false;
        }
        insegnanteCollectionIdentifiers.push(insegnanteIdentifier);
        return true;
      });
      return [...insegnantesToAdd, ...insegnanteCollection];
    }
    return insegnanteCollection;
  }
}
