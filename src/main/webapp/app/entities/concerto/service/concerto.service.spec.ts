import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IConcerto } from '../concerto.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../concerto.test-samples';

import { ConcertoService, RestConcerto } from './concerto.service';

const requireRestSample: RestConcerto = {
  ...sampleWithRequiredData,
  data: sampleWithRequiredData.data?.format(DATE_FORMAT),
};

describe('Concerto Service', () => {
  let service: ConcertoService;
  let httpMock: HttpTestingController;
  let expectedResult: IConcerto | IConcerto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConcertoService);
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

    it('should create a Concerto', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const concerto = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(concerto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Concerto', () => {
      const concerto = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(concerto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Concerto', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Concerto', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Concerto', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConcertoToCollectionIfMissing', () => {
      it('should add a Concerto to an empty array', () => {
        const concerto: IConcerto = sampleWithRequiredData;
        expectedResult = service.addConcertoToCollectionIfMissing([], concerto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concerto);
      });

      it('should not add a Concerto to an array that contains it', () => {
        const concerto: IConcerto = sampleWithRequiredData;
        const concertoCollection: IConcerto[] = [
          {
            ...concerto,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, concerto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Concerto to an array that doesn't contain it", () => {
        const concerto: IConcerto = sampleWithRequiredData;
        const concertoCollection: IConcerto[] = [sampleWithPartialData];
        expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, concerto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concerto);
      });

      it('should add only unique Concerto to an array', () => {
        const concertoArray: IConcerto[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const concertoCollection: IConcerto[] = [sampleWithRequiredData];
        expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, ...concertoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const concerto: IConcerto = sampleWithRequiredData;
        const concerto2: IConcerto = sampleWithPartialData;
        expectedResult = service.addConcertoToCollectionIfMissing([], concerto, concerto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concerto);
        expect(expectedResult).toContain(concerto2);
      });

      it('should accept null and undefined values', () => {
        const concerto: IConcerto = sampleWithRequiredData;
        expectedResult = service.addConcertoToCollectionIfMissing([], null, concerto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concerto);
      });

      it('should return initial array if no Concerto is added', () => {
        const concertoCollection: IConcerto[] = [sampleWithRequiredData];
        expectedResult = service.addConcertoToCollectionIfMissing(concertoCollection, undefined, null);
        expect(expectedResult).toEqual(concertoCollection);
      });
    });

    describe('compareConcerto', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConcerto(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConcerto(entity1, entity2);
        const compareResult2 = service.compareConcerto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConcerto(entity1, entity2);
        const compareResult2 = service.compareConcerto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConcerto(entity1, entity2);
        const compareResult2 = service.compareConcerto(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
