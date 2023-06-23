import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClienteCorsoDetailComponent } from './cliente-corso-detail.component';

describe('ClienteCorso Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCorsoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClienteCorsoDetailComponent,
              resolve: { clienteCorso: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ClienteCorsoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load clienteCorso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClienteCorsoDetailComponent);

      // THEN
      expect(instance.clienteCorso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
