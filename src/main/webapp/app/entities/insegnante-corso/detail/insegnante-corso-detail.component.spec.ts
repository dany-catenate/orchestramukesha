import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsegnanteCorsoDetailComponent } from './insegnante-corso-detail.component';

describe('InsegnanteCorso Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsegnanteCorsoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InsegnanteCorsoDetailComponent,
              resolve: { insegnanteCorso: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(InsegnanteCorsoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load insegnanteCorso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InsegnanteCorsoDetailComponent);

      // THEN
      expect(instance.insegnanteCorso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
