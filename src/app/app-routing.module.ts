import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard], data: { role: ['admin', 'Talent'] }
  },
  {
    path: 'written', loadChildren: () => import('./modules/written-station/written-station.module').then(m => m.WrittenStationModule)
  },
  {
    path: 'technical/:id', loadChildren: () => import('./modules/technical-station/technical-station.module').then(m => m.TechnicalStationModule)
  },
  {
    path: 'hr', loadChildren: () => import('./modules/hr-station/hr-station.module').then(m => m.HrStationModule)
  },
  {
    path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
