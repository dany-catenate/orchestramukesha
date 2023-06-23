import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsegnanteService } from '../service/insegnante.service';

import { InsegnanteComponent } from './insegnante.component';

describe('Insegnante Management Component', () => {
  let comp: InsegnanteComponent;
  let fixture: ComponentFixture<InsegnanteComponent>;
  let service: InsegnanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'insegnante', component: InsegnanteComponent }]),
        HttpClientTestingModule,
        InsegnanteComponent,
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
      .overrideTemplate(InsegnanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsegnanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InsegnanteService);

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
    expect(comp.insegnantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to insegnanteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInsegnanteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInsegnanteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
