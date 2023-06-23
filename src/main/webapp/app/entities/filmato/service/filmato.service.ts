import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFilmato, NewFilmato } from '../filmato.model';

export type PartialUpdateFilmato = Partial<IFilmato> & Pick<IFilmato, 'id'>;

export type EntityResponseType = HttpResponse<IFilmato>;
export type EntityArrayResponseType = HttpResponse<IFilmato[]>;

@Injectable({ providedIn: 'root' })
export class FilmatoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/filmatoes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(filmato: NewFilmato): Observable<EntityResponseType> {
    return this.http.post<IFilmato>(this.resourceUrl, filmato, { observe: 'response' });
  }

  update(filmato: IFilmato): Observable<EntityResponseType> {
    return this.http.put<IFilmato>(`${this.resourceUrl}/${this.getFilmatoIdentifier(filmato)}`, filmato, { observe: 'response' });
  }

  partialUpdate(filmato: PartialUpdateFilmato): Observable<EntityResponseType> {
    return this.http.patch<IFilmato>(`${this.resourceUrl}/${this.getFilmatoIdentifier(filmato)}`, filmato, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFilmato>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFilmato[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFilmatoIdentifier(filmato: Pick<IFilmato, 'id'>): number {
    return filmato.id;
  }

  compareFilmato(o1: Pick<IFilmato, 'id'> | null, o2: Pick<IFilmato, 'id'> | null): boolean {
    return o1 && o2 ? this.getFilmatoIdentifier(o1) === this.getFilmatoIdentifier(o2) : o1 === o2;
  }

  addFilmatoToCollectionIfMissing<Type extends Pick<IFilmato, 'id'>>(
    filmatoCollection: Type[],
    ...filmatoesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const filmatoes: Type[] = filmatoesToCheck.filter(isPresent);
    if (filmatoes.length > 0) {
      const filmatoCollectionIdentifiers = filmatoCollection.map(filmatoItem => this.getFilmatoIdentifier(filmatoItem)!);
      const filmatoesToAdd = filmatoes.filter(filmatoItem => {
        const filmatoIdentifier = this.getFilmatoIdentifier(filmatoItem);
        if (filmatoCollectionIdentifiers.includes(filmatoIdentifier)) {
          return false;
        }
        filmatoCollectionIdentifiers.push(filmatoIdentifier);
        return true;
      });
      return [...filmatoesToAdd, ...filmatoCollection];
    }
    return filmatoCollection;
  }
}
