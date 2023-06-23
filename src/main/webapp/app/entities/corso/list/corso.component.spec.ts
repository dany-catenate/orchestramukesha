import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CorsoService } from '../service/corso.service';

import { CorsoComponent } from './corso.component';

describe('Corso Management Component', () => {
  let comp: CorsoComponent;
  let fixture: ComponentFixture<CorsoComponent>;
  let service: CorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'corso', component: CorsoComponent }]), HttpClientTestingModule, CorsoComponent],
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
      .overrideTemplate(CorsoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CorsoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CorsoService);

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
    expect(comp.corsos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to corsoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCorsoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCorsoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
