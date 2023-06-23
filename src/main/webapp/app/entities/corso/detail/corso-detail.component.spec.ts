import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CorsoDetailComponent } from './corso-detail.component';

describe('Corso Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorsoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CorsoDetailComponent,
              resolve: { corso: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(CorsoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load corso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CorsoDetailComponent);

      // THEN
      expect(instance.corso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
