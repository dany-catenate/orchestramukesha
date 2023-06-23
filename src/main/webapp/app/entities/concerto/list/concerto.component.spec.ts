import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConcertoService } from '../service/concerto.service';

import { ConcertoComponent } from './concerto.component';

describe('Concerto Management Component', () => {
  let comp: ConcertoComponent;
  let fixture: ComponentFixture<ConcertoComponent>;
  let service: ConcertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'concerto', component: ConcertoComponent }]),
        HttpClientTestingModule,
        ConcertoComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ConcertoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConcertoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConcertoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.concertos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to concertoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getConcertoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getConcertoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
