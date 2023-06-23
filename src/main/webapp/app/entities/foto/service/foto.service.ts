import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoto, NewFoto } from '../foto.model';

export type PartialUpdateFoto = Partial<IFoto> & Pick<IFoto, 'id'>;

export type EntityResponseType = HttpResponse<IFoto>;
export type EntityArrayResponseType = HttpResponse<IFoto[]>;

@Injectable({ providedIn: 'root' })
export class FotoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fotos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foto: NewFoto): Observable<EntityResponseType> {
    return this.http.post<IFoto>(this.resourceUrl, foto, { observe: 'response' });
  }

  update(foto: IFoto): Observable<EntityResponseType> {
    return this.http.put<IFoto>(`${this.resourceUrl}/${this.getFotoIdentifier(foto)}`, foto, { observe: 'response' });
  }

  partialUpdate(foto: PartialUpdateFoto): Observable<EntityResponseType> {
    return this.http.patch<IFoto>(`${this.resourceUrl}/${this.getFotoIdentifier(foto)}`, foto, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFotoIdentifier(foto: Pick<IFoto, 'id'>): number {
    return foto.id;
  }

  compareFoto(o1: Pick<IFoto, 'id'> | null, o2: Pick<IFoto, 'id'> | null): boolean {
    return o1 && o2 ? this.getFotoIdentifier(o1) === this.getFotoIdentifier(o2) : o1 === o2;
  }

  addFotoToCollectionIfMissing<Type extends Pick<IFoto, 'id'>>(
    fotoCollection: Type[],
    ...fotosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fotos: Type[] = fotosToCheck.filter(isPresent);
    if (fotos.length > 0) {
      const fotoCollectionIdentifiers = fotoCollection.map(fotoItem => this.getFotoIdentifier(fotoItem)!);
      const fotosToAdd = fotos.filter(fotoItem => {
        const fotoIdentifier = this.getFotoIdentifier(fotoItem);
        if (fotoCollectionIdentifiers.includes(fotoIdentifier)) {
          return false;
        }
        fotoCollectionIdentifiers.push(fotoIdentifier);
        return true;
      });
      return [...fotosToAdd, ...fotoCollection];
    }
    return fotoCollection;
  }
}
