import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  /* {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }, */
  {
    path: 'dashboard',
    /* canActivate: [authGuard], */
    component: DashboardComponent,
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
