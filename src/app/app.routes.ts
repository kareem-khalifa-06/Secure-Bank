import { authGuard, adminGuard } from './../core/guards/auth.guard';
import { Routes } from '@angular/router';
import { UserHomeComponent } from '../components/user-home/user-home.component';
import { UserAccountComponent } from '../components/user-account/user-account.component';
import { UserTransactionComponent } from '../components/user-transaction/user-transaction.component';
import { UserTransferComponent } from '../components/user-transfer/user-transfer.component';
import { AdminHomeComponent } from '../components/admin-home/admin-home.component';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./../components/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },

  {
    path: 'user',
    canActivate: [authGuard],           
    loadComponent: () => import('./../layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    loadChildren: () => [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',         component: UserHomeComponent,        title: 'Home' },
      { path: 'account',      component: UserAccountComponent,     title: 'Account Overview' },
      { path: 'transactions', component: UserTransactionComponent, title: 'Transactions' },
      { path: 'transfer',     component: UserTransferComponent,    title: 'Transfer Funds' },
    ],
  },

  {
    path: 'admin',
    canActivate: [adminGuard],          
    loadComponent: () => import('./../layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    loadChildren: () => [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',        component: AdminHomeComponent,      title: 'Admin Home' },
      { path: 'admin-panel', component: AdminDashboardComponent, title: 'Dashboard' },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./../components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Not Found'
  },
];