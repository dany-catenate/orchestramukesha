import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICorso } from '../corso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../corso.test-samples';

import { CorsoService } from './corso.service';

const requireRestSample: ICorso = {
  ...sampleWithRequiredData,
};

describe('Corso Service', () => {
  let service: CorsoService;
  let httpMock: HttpTestingController;
  let expectedResult: ICorso | ICorso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CorsoService);
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

    it('should create a Corso', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const corso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(corso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Corso', () => {
      const corso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(corso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Corso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Corso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Corso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCorsoToCollectionIfMissing', () => {
      it('should add a Corso to an empty array', () => {
        const corso: ICorso = sampleWithRequiredData;
        expectedResult = service.addCorsoToCollectionIfMissing([], corso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(corso);
      });

      it('should not add a Corso to an array that contains it', () => {
        const corso: ICorso = sampleWithRequiredData;
        const corsoCollection: ICorso[] = [
          {
            ...corso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, corso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Corso to an array that doesn't contain it", () => {
        const corso: ICorso = sampleWithRequiredData;
        const corsoCollection: ICorso[] = [sampleWithPartialData];
        expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, corso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(corso);
      });

      it('should add only unique Corso to an array', () => {
        const corsoArray: ICorso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const corsoCollection: ICorso[] = [sampleWithRequiredData];
        expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, ...corsoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const corso: ICorso = sampleWithRequiredData;
        const corso2: ICorso = sampleWithPartialData;
        expectedResult = service.addCorsoToCollectionIfMissing([], corso, corso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(corso);
        expect(expectedResult).toContain(corso2);
      });

      it('should accept null and undefined values', () => {
        const corso: ICorso = sampleWithRequiredData;
        expectedResult = service.addCorsoToCollectionIfMissing([], null, corso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(corso);
      });

      it('should return initial array if no Corso is added', () => {
        const corsoCollection: ICorso[] = [sampleWithRequiredData];
        expectedResult = service.addCorsoToCollectionIfMissing(corsoCollection, undefined, null);
        expect(expectedResult).toEqual(corsoCollection);
      });
    });

    describe('compareCorso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCorso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCorso(entity1, entity2);
        const compareResult2 = service.compareCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCorso(entity1, entity2);
        const compareResult2 = service.compareCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCorso(entity1, entity2);
        const compareResult2 = service.compareCorso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
