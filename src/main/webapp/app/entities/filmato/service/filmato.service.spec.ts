import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFilmato } from '../filmato.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../filmato.test-samples';

import { FilmatoService } from './filmato.service';

const requireRestSample: IFilmato = {
  ...sampleWithRequiredData,
};

describe('Filmato Service', () => {
  let service: FilmatoService;
  let httpMock: HttpTestingController;
  let expectedResult: IFilmato | IFilmato[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FilmatoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Filmato', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const filmato = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(filmato).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Filmato', () => {
      const filmato = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(filmato).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Filmato', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Filmato', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Filmato', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFilmatoToCollectionIfMissing', () => {
      it('should add a Filmato to an empty array', () => {
        const filmato: IFilmato = sampleWithRequiredData;
        expectedResult = service.addFilmatoToCollectionIfMissing([], filmato);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filmato);
      });

      it('should not add a Filmato to an array that contains it', () => {
        const filmato: IFilmato = sampleWithRequiredData;
        const filmatoCollection: IFilmato[] = [
          {
            ...filmato,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFilmatoToCollectionIfMissing(filmatoCollection, filmato);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Filmato to an array that doesn't contain it", () => {
        const filmato: IFilmato = sampleWithRequiredData;
        const filmatoCollection: IFilmato[] = [sampleWithPartialData];
        expectedResult = service.addFilmatoToCollectionIfMissing(filmatoCollection, filmato);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filmato);
      });

      it('should add only unique Filmato to an array', () => {
        const filmatoArray: IFilmato[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const filmatoCollection: IFilmato[] = [sampleWithRequiredData];
        expectedResult = service.addFilmatoToCollectionIfMissing(filmatoCollection, ...filmatoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const filmato: IFilmato = sampleWithRequiredData;
        const filmato2: IFilmato = sampleWithPartialData;
        expectedResult = service.addFilmatoToCollectionIfMissing([], filmato, filmato2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filmato);
        expect(expectedResult).toContain(filmato2);
      });

      it('should accept null and undefined values', () => {
        const filmato: IFilmato = sampleWithRequiredData;
        expectedResult = service.addFilmatoToCollectionIfMissing([], null, filmato, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filmato);
      });

      it('should return initial array if no Filmato is added', () => {
        const filmatoCollection: IFilmato[] = [sampleWithRequiredData];
        expectedResult = service.addFilmatoToCollectionIfMissing(filmatoCollection, undefined, null);
        expect(expectedResult).toEqual(filmatoCollection);
      });
    });

    describe('compareFilmato', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFilmato(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFilmato(entity1, entity2);
        const compareResult2 = service.compareFilmato(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFilmato(entity1, entity2);
        const compareResult2 = service.compareFilmato(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFilmato(entity1, entity2);
        const compareResult2 = service.compareFilmato(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
