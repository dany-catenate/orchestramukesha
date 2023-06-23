import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsegnanteDetailComponent } from './insegnante-detail.component';

describe('Insegnante Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsegnanteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InsegnanteDetailComponent,
              resolve: { insegnante: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(InsegnanteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load insegnante on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InsegnanteDetailComponent);

      // THEN
      expect(instance.insegnante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
