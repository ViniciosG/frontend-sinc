import { Routes } from '@angular/router';
import { GoalsBySellersComponent } from './goals-by-sellers/goals-by-sellers.component';

// Forms

export const SincRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'goalsBySellers',
        component: GoalsBySellersComponent,
        data: {
          title: 'Sales',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
    ],
  },
];
