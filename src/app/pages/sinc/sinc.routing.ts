import { Routes } from '@angular/router';
import { GoalsBySellersComponent } from './goals-by-sellers/goals-by-sellers.component';
import { NewCustomersPerMonthComponent } from './new-customers-per-month/new-customers-per-month.component';
import { NewCustomersPerSellersComponent } from './new-customers-per-sellers/new-customers-per-sellers.component';
import { ProductsSoldComponent } from './products-sold/products-sold.component';
import { SalesByDayOfWeekComponent } from './sales-by-day-of-week/sales-by-day-of-week.component';
import { SalesByManufacturersComponent } from './sales-by-manufacturers/sales-by-manufacturers.component';
import { SalesByMonthComponent } from './sales-by-month/sales-by-month.component';

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
      {
        path: 'newCustomersPerSellers',
        component: NewCustomersPerSellersComponent,
        data: {
          title: 'Novos Clientes / Vendedor',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
      {
        path: 'newCustomersPerMonth',
        component: NewCustomersPerMonthComponent,
        data: {
          title: 'Novos Clientes / Mês',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
      {
        path: 'salesByManufacturers',
        component: SalesByManufacturersComponent,
        data: {
          title: 'Vendas / Produtos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
      {
        path: 'salesByDayOfWeek',
        component: SalesByDayOfWeekComponent,
        data: {
          title: 'Vendas / Dia da Semana',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
      {
        path: 'salesByMonth',
        component: SalesByMonthComponent,
        data: {
          title: 'Vendas / Mês',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales' },
          ],
        },
      },
    ],
  },
];
