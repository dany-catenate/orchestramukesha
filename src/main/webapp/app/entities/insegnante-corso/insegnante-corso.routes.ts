import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InsegnanteCorsoComponent } from './list/insegnante-corso.component';
import { InsegnanteCorsoDetailComponent } from './detail/insegnante-corso-detail.component';
import { InsegnanteCorsoUpdateComponent } from './update/insegnante-corso-update.component';
import InsegnanteCorsoResolve from './route/insegnante-corso-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const insegnanteCorsoRoute: Routes = [
  {
    path: '',
    component: InsegnanteCorsoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InsegnanteCorsoDetailComponent,
    resolve: {
      insegnanteCorso: InsegnanteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InsegnanteCorsoUpdateComponent,
    resolve: {
      insegnanteCorso: InsegnanteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InsegnanteCorsoUpdateComponent,
    resolve: {
      insegnanteCorso: InsegnanteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default insegnanteCorsoRoute;
