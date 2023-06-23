import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FotoComponent } from './list/foto.component';
import { FotoDetailComponent } from './detail/foto-detail.component';
import { FotoUpdateComponent } from './update/foto-update.component';
import FotoResolve from './route/foto-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const fotoRoute: Routes = [
  {
    path: '',
    component: FotoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FotoDetailComponent,
    resolve: {
      foto: FotoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FotoUpdateComponent,
    resolve: {
      foto: FotoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FotoUpdateComponent,
    resolve: {
      foto: FotoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default fotoRoute;
