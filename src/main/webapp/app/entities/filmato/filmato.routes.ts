import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FilmatoComponent } from './list/filmato.component';
import { FilmatoDetailComponent } from './detail/filmato-detail.component';
import { FilmatoUpdateComponent } from './update/filmato-update.component';
import FilmatoResolve from './route/filmato-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const filmatoRoute: Routes = [
  {
    path: '',
    component: FilmatoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FilmatoDetailComponent,
    resolve: {
      filmato: FilmatoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FilmatoUpdateComponent,
    resolve: {
      filmato: FilmatoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FilmatoUpdateComponent,
    resolve: {
      filmato: FilmatoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default filmatoRoute;
