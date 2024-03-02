import { Routes } from '@angular/router';
import { GoalsBySellersComponent } from './goals-by-sellers/goals-by-sellers.component';
import { ProductsSoldComponent } from './products-sold/products-sold.component';

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
      {
        path: 'productsSold',
        component: ProductsSoldComponent,
        data: {
          title: 'Produtos mais vendidos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
    ],
  },
];
