import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConcertoDetailComponent } from './concerto-detail.component';

describe('Concerto Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ConcertoDetailComponent,
              resolve: { concerto: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ConcertoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load concerto on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ConcertoDetailComponent);

      // THEN
      expect(instance.concerto).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
