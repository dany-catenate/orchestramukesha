import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClienteCorso } from '../cliente-corso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cliente-corso.test-samples';

import { ClienteCorsoService } from './cliente-corso.service';

const requireRestSample: IClienteCorso = {
  ...sampleWithRequiredData,
};

describe('ClienteCorso Service', () => {
  let service: ClienteCorsoService;
  let httpMock: HttpTestingController;
  let expectedResult: IClienteCorso | IClienteCorso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClienteCorsoService);
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

    it('should create a ClienteCorso', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const clienteCorso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clienteCorso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClienteCorso', () => {
      const clienteCorso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clienteCorso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClienteCorso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClienteCorso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClienteCorso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClienteCorsoToCollectionIfMissing', () => {
      it('should add a ClienteCorso to an empty array', () => {
        const clienteCorso: IClienteCorso = sampleWithRequiredData;
        expectedResult = service.addClienteCorsoToCollectionIfMissing([], clienteCorso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clienteCorso);
      });

      it('should not add a ClienteCorso to an array that contains it', () => {
        const clienteCorso: IClienteCorso = sampleWithRequiredData;
        const clienteCorsoCollection: IClienteCorso[] = [
          {
            ...clienteCorso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClienteCorsoToCollectionIfMissing(clienteCorsoCollection, clienteCorso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClienteCorso to an array that doesn't contain it", () => {
        const clienteCorso: IClienteCorso = sampleWithRequiredData;
        const clienteCorsoCollection: IClienteCorso[] = [sampleWithPartialData];
        expectedResult = service.addClienteCorsoToCollectionIfMissing(clienteCorsoCollection, clienteCorso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clienteCorso);
      });

      it('should add only unique ClienteCorso to an array', () => {
        const clienteCorsoArray: IClienteCorso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clienteCorsoCollection: IClienteCorso[] = [sampleWithRequiredData];
        expectedResult = service.addClienteCorsoToCollectionIfMissing(clienteCorsoCollection, ...clienteCorsoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clienteCorso: IClienteCorso = sampleWithRequiredData;
        const clienteCorso2: IClienteCorso = sampleWithPartialData;
        expectedResult = service.addClienteCorsoToCollectionIfMissing([], clienteCorso, clienteCorso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clienteCorso);
        expect(expectedResult).toContain(clienteCorso2);
      });

      it('should accept null and undefined values', () => {
        const clienteCorso: IClienteCorso = sampleWithRequiredData;
        expectedResult = service.addClienteCorsoToCollectionIfMissing([], null, clienteCorso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clienteCorso);
      });

      it('should return initial array if no ClienteCorso is added', () => {
        const clienteCorsoCollection: IClienteCorso[] = [sampleWithRequiredData];
        expectedResult = service.addClienteCorsoToCollectionIfMissing(clienteCorsoCollection, undefined, null);
        expect(expectedResult).toEqual(clienteCorsoCollection);
      });
    });

    describe('compareClienteCorso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClienteCorso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClienteCorso(entity1, entity2);
        const compareResult2 = service.compareClienteCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClienteCorso(entity1, entity2);
        const compareResult2 = service.compareClienteCorso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClienteCorso(entity1, entity2);
        const compareResult2 = service.compareClienteCorso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
