import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './account/login/login.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
    ]
  },
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
