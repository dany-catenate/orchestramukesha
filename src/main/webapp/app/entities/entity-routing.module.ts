import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'corso',
        data: { pageTitle: 'Corsos' },
        loadChildren: () => import('./corso/corso.routes'),
      },
      {
        path: 'insegnante',
        data: { pageTitle: 'Insegnantes' },
        loadChildren: () => import('./insegnante/insegnante.routes'),
      },
      {
        path: 'cliente',
        data: { pageTitle: 'Clientes' },
        loadChildren: () => import('./cliente/cliente.routes'),
      },
      {
        path: 'concerto',
        data: { pageTitle: 'Concertos' },
        loadChildren: () => import('./concerto/concerto.routes'),
      },
      {
        path: 'foto',
        data: { pageTitle: 'Fotos' },
        loadChildren: () => import('./foto/foto.routes'),
      },
      {
        path: 'filmato',
        data: { pageTitle: 'Filmatoes' },
        loadChildren: () => import('./filmato/filmato.routes'),
      },
      {
        path: 'insegnante-corso',
        data: { pageTitle: 'InsegnanteCorsos' },
        loadChildren: () => import('./insegnante-corso/insegnante-corso.routes'),
      },
      {
        path: 'cliente-corso',
        data: { pageTitle: 'ClienteCorsos' },
        loadChildren: () => import('./cliente-corso/cliente-corso.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
