import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerComponent } from './player/player.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'videoplayer/:id', component: PlayerComponent },
];
