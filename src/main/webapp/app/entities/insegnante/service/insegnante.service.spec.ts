import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInsegnante } from '../insegnante.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../insegnante.test-samples';

import { InsegnanteService } from './insegnante.service';

const requireRestSample: IInsegnante = {
  ...sampleWithRequiredData,
};

describe('Insegnante Service', () => {
  let service: InsegnanteService;
  let httpMock: HttpTestingController;
  let expectedResult: IInsegnante | IInsegnante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InsegnanteService);
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

    it('should create a Insegnante', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const insegnante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(insegnante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Insegnante', () => {
      const insegnante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(insegnante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Insegnante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Insegnante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Insegnante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInsegnanteToCollectionIfMissing', () => {
      it('should add a Insegnante to an empty array', () => {
        const insegnante: IInsegnante = sampleWithRequiredData;
        expectedResult = service.addInsegnanteToCollectionIfMissing([], insegnante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insegnante);
      });

      it('should not add a Insegnante to an array that contains it', () => {
        const insegnante: IInsegnante = sampleWithRequiredData;
        const insegnanteCollection: IInsegnante[] = [
          {
            ...insegnante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, insegnante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Insegnante to an array that doesn't contain it", () => {
        const insegnante: IInsegnante = sampleWithRequiredData;
        const insegnanteCollection: IInsegnante[] = [sampleWithPartialData];
        expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, insegnante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insegnante);
      });

      it('should add only unique Insegnante to an array', () => {
        const insegnanteArray: IInsegnante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const insegnanteCollection: IInsegnante[] = [sampleWithRequiredData];
        expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, ...insegnanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const insegnante: IInsegnante = sampleWithRequiredData;
        const insegnante2: IInsegnante = sampleWithPartialData;
        expectedResult = service.addInsegnanteToCollectionIfMissing([], insegnante, insegnante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insegnante);
        expect(expectedResult).toContain(insegnante2);
      });

      it('should accept null and undefined values', () => {
        const insegnante: IInsegnante = sampleWithRequiredData;
        expectedResult = service.addInsegnanteToCollectionIfMissing([], null, insegnante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insegnante);
      });

      it('should return initial array if no Insegnante is added', () => {
        const insegnanteCollection: IInsegnante[] = [sampleWithRequiredData];
        expectedResult = service.addInsegnanteToCollectionIfMissing(insegnanteCollection, undefined, null);
        expect(expectedResult).toEqual(insegnanteCollection);
      });
    });

    describe('compareInsegnante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInsegnante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInsegnante(entity1, entity2);
        const compareResult2 = service.compareInsegnante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInsegnante(entity1, entity2);
        const compareResult2 = service.compareInsegnante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInsegnante(entity1, entity2);
        const compareResult2 = service.compareInsegnante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
