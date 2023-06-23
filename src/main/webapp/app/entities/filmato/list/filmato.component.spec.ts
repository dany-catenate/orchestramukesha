import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FilmatoService } from '../service/filmato.service';

import { FilmatoComponent } from './filmato.component';

describe('Filmato Management Component', () => {
  let comp: FilmatoComponent;
  let fixture: ComponentFixture<FilmatoComponent>;
  let service: FilmatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'filmato', component: FilmatoComponent }]),
        HttpClientTestingModule,
        FilmatoComponent,
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
      .overrideTemplate(FilmatoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FilmatoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FilmatoService);

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
    expect(comp.filmatoes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to filmatoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFilmatoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFilmatoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
