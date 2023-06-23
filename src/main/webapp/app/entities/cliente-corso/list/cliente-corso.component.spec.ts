import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClienteCorsoService } from '../service/cliente-corso.service';

import { ClienteCorsoComponent } from './cliente-corso.component';

describe('ClienteCorso Management Component', () => {
  let comp: ClienteCorsoComponent;
  let fixture: ComponentFixture<ClienteCorsoComponent>;
  let service: ClienteCorsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'cliente-corso', component: ClienteCorsoComponent }]),
        HttpClientTestingModule,
        ClienteCorsoComponent,
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
      .overrideTemplate(ClienteCorsoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClienteCorsoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClienteCorsoService);

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
    expect(comp.clienteCorsos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to clienteCorsoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClienteCorsoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClienteCorsoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
