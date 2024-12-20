import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './guards/auth-guard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuardService]
    },
];
