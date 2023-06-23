import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInsegnanteCorso } from '../insegnante-corso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../insegnante-corso.test-samples';

import { InsegnanteCorsoService } from './insegnante-corso.service';

const requireRestSample: IInsegnanteCorso = {
  ...sampleWithRequiredData,
};

describe('InsegnanteCorso Service', () => {
  let service: InsegnanteCorsoService;
  let httpMock: HttpTestingController;
  let expectedResult: IInsegnanteCorso | IInsegnanteCorso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InsegnanteCorsoService);
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

    it('should create a InsegnanteCorso', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const insegnanteCorso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(insegnanteCorso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InsegnanteCorso', () => {
      const insegnanteCorso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(insegnanteCorso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InsegnanteCorso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InsegnanteCorso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InsegnanteCorso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInsegnanteCorsoToCollectionIfMissing', () => {
      it('should add a InsegnanteCorso to an empty array', () => {
        const insegnanteCorso: IInsegnanteCorso = sampleWithRequiredData;
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing([], insegnanteCorso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insegnanteCorso);
      });

      it('should not add a InsegnanteCorso to an array that contains it', () => {
        const insegnanteCorso: IInsegnanteCorso = sampleWithRequiredData;
        const insegnanteCorsoCollection: IInsegnanteCorso[] = [
          {
            ...insegnanteCorso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing(insegnanteCorsoCollection, insegnanteCorso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InsegnanteCorso to an array that doesn't contain it", () => {
        const insegnanteCorso: IInsegnanteCorso = sampleWithRequiredData;
        const insegnanteCorsoCollection: IInsegnanteCorso[] = [sampleWithPartialData];
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing(insegnanteCorsoCollection, insegnanteCorso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insegnanteCorso);
      });

      it('should add only unique InsegnanteCorso to an array', () => {
        const insegnanteCorsoArray: IInsegnanteCorso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const insegnanteCorsoCollection: IInsegnanteCorso[] = [sampleWithRequiredData];
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing(insegnanteCorsoCollection, ...insegnanteCorsoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const insegnanteCorso: IInsegnanteCorso = sampleWithRequiredData;
        const insegnanteCorso2: IInsegnanteCorso = sampleWithPartialData;
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing([], insegnanteCorso, insegnanteCorso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insegnanteCorso);
        expect(expectedResult).toContain(insegnanteCorso2);
      });

      it('should accept null and undefined values', () => {
        const insegnanteCorso: IInsegnanteCorso = sampleWithRequiredData;
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing([], null, insegnanteCorso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insegnanteCorso);
      });

      it('should return initial array if no InsegnanteCorso is added', () => {
        const insegnanteCorsoCollection: IInsegnanteCorso[] = [sampleWithRequiredData];
        expectedResult = service.addInsegnanteCorsoToCollectionIfMissing(insegnanteCorsoCollection, undefined, null);
        expect(expectedResult).toEqual(insegnanteCorsoCollection);
      });
    });

    describe('compareInsegnanteCorso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInsegnanteCorso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInsegnanteCorso(entity1, entity2);
        const compareResult2 = service.compareInsegnanteCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInsegnanteCorso(entity1, entity2);
        const compareResult2 = service.compareInsegnanteCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInsegnanteCorso(entity1, entity2);
        const compareResult2 = service.compareInsegnanteCorso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
