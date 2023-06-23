import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClienteCorsoComponent } from './list/cliente-corso.component';
import { ClienteCorsoDetailComponent } from './detail/cliente-corso-detail.component';
import { ClienteCorsoUpdateComponent } from './update/cliente-corso-update.component';
import ClienteCorsoResolve from './route/cliente-corso-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const clienteCorsoRoute: Routes = [
  {
    path: '',
    component: ClienteCorsoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClienteCorsoDetailComponent,
    resolve: {
      clienteCorso: ClienteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClienteCorsoUpdateComponent,
    resolve: {
      clienteCorso: ClienteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClienteCorsoUpdateComponent,
    resolve: {
      clienteCorso: ClienteCorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clienteCorsoRoute;
