import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { PredictComponent } from './predict/predict';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'predict', component: PredictComponent },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  { path: '**', redirectTo: '/login' }
];
