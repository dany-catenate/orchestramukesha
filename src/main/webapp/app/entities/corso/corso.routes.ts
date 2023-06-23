import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CorsoComponent } from './list/corso.component';
import { CorsoDetailComponent } from './detail/corso-detail.component';
import { CorsoUpdateComponent } from './update/corso-update.component';
import CorsoResolve from './route/corso-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const corsoRoute: Routes = [
  {
    path: '',
    component: CorsoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CorsoDetailComponent,
    resolve: {
      corso: CorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CorsoUpdateComponent,
    resolve: {
      corso: CorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CorsoUpdateComponent,
    resolve: {
      corso: CorsoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default corsoRoute;
