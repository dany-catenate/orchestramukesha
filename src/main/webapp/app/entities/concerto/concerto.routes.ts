import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConcertoComponent } from './list/concerto.component';
import { ConcertoDetailComponent } from './detail/concerto-detail.component';
import { ConcertoUpdateComponent } from './update/concerto-update.component';
import ConcertoResolve from './route/concerto-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const concertoRoute: Routes = [
  {
    path: '',
    component: ConcertoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConcertoDetailComponent,
    resolve: {
      concerto: ConcertoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConcertoUpdateComponent,
    resolve: {
      concerto: ConcertoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConcertoUpdateComponent,
    resolve: {
      concerto: ConcertoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default concertoRoute;
