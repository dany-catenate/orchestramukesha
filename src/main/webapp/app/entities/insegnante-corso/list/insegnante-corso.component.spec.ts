import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsegnanteCorsoService } from '../service/insegnante-corso.service';

import { InsegnanteCorsoComponent } from './insegnante-corso.component';

describe('InsegnanteCorso Management Component', () => {
  let comp: InsegnanteCorsoComponent;
  let fixture: ComponentFixture<InsegnanteCorsoComponent>;
  let service: InsegnanteCorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'insegnante-corso', component: InsegnanteCorsoComponent }]),
        HttpClientTestingModule,
        InsegnanteCorsoComponent,
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
      .overrideTemplate(InsegnanteCorsoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsegnanteCorsoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InsegnanteCorsoService);

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
    expect(comp.insegnanteCorsos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to insegnanteCorsoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInsegnanteCorsoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInsegnanteCorsoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
