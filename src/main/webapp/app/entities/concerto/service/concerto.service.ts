import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConcerto, NewConcerto } from '../concerto.model';

export type PartialUpdateConcerto = Partial<IConcerto> & Pick<IConcerto, 'id'>;

type RestOf<T extends IConcerto | NewConcerto> = Omit<T, 'data'> & {
  data?: string | null;
};

export type RestConcerto = RestOf<IConcerto>;

export type NewRestConcerto = RestOf<NewConcerto>;

export type PartialUpdateRestConcerto = RestOf<PartialUpdateConcerto>;

export type EntityResponseType = HttpResponse<IConcerto>;
export type EntityArrayResponseType = HttpResponse<IConcerto[]>;

@Injectable({ providedIn: 'root' })
export class ConcertoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/concertos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(concerto: NewConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .post<RestConcerto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(concerto: IConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .put<RestConcerto>(`${this.resourceUrl}/${this.getConcertoIdentifier(concerto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(concerto: PartialUpdateConcerto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concerto);
    return this.http
      .patch<RestConcerto>(`${this.resourceUrl}/${this.getConcertoIdentifier(concerto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConcerto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConcerto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConcertoIdentifier(concerto: Pick<IConcerto, 'id'>): number {
    return concerto.id;
  }

  compareConcerto(o1: Pick<IConcerto, 'id'> | null, o2: Pick<IConcerto, 'id'> | null): boolean {
    return o1 && o2 ? this.getConcertoIdentifier(o1) === this.getConcertoIdentifier(o2) : o1 === o2;
  }

  addConcertoToCollectionIfMissing<Type extends Pick<IConcerto, 'id'>>(
    concertoCollection: Type[],
    ...concertosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const concertos: Type[] = concertosToCheck.filter(isPresent);
    if (concertos.length > 0) {
      const concertoCollectionIdentifiers = concertoCollection.map(concertoItem => this.getConcertoIdentifier(concertoItem)!);
      const concertosToAdd = concertos.filter(concertoItem => {
        const concertoIdentifier = this.getConcertoIdentifier(concertoItem);
        if (concertoCollectionIdentifiers.includes(concertoIdentifier)) {
          return false;
        }
        concertoCollectionIdentifiers.push(concertoIdentifier);
        return true;
      });
      return [...concertosToAdd, ...concertoCollection];
    }
    return concertoCollection;
  }

  protected convertDateFromClient<T extends IConcerto | NewConcerto | PartialUpdateConcerto>(concerto: T): RestOf<T> {
    return {
      ...concerto,
      data: concerto.data?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restConcerto: RestConcerto): IConcerto {
    return {
      ...restConcerto,
      data: restConcerto.data ? dayjs(restConcerto.data) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConcerto>): HttpResponse<IConcerto> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConcerto[]>): HttpResponse<IConcerto[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
