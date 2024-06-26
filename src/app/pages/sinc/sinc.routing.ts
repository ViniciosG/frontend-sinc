import { Routes } from '@angular/router';
import { GoalsBySellersMonthComponent } from './goals-by-sellers-month/goals-by-sellers-month.component';
import { GoalsBySellersComponent } from './goals-by-sellers/goals-by-sellers.component';
import { MarginByProductsComponent } from './margin-by-products/margin-by-products.component';
import { MarginBySubGroupsComponent } from './margin-by-sub-groups/margin-by-sub-groups.component';
import { NewCustomersPerMonthComponent } from './new-customers-per-month/new-customers-per-month.component';
import { NewCustomersPerSellersComponent } from './new-customers-per-sellers/new-customers-per-sellers.component';
import { ProductsSoldComponent } from './products-sold/products-sold.component';
import { SalesByDayOfWeekComponent } from './sales-by-day-of-week/sales-by-day-of-week.component';
import { SalesByManufacturersComponent } from './sales-by-manufacturers/sales-by-manufacturers.component';
import { SalesByMonthComponent } from './sales-by-month/sales-by-month.component';
import { SalesByStatesComponent } from './sales-by-states/sales-by-states.component';
import { SubGroupsSoldComponent } from './sub-groups-sold/sub-groups-sold.component';

// Forms

export const SincRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'goalsBySellers',
        component: GoalsBySellersComponent,
        data: {
          title: 'Metas',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Metas' },
          ],
        },
      },
      {
        path: 'goalsBySellersByMonth',
        component: GoalsBySellersMonthComponent,
        data: {
          title: 'Metas / Mês',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Metas / Mês' },
          ],
        },
      },
      {
        path: 'productsSold',
        component: ProductsSoldComponent,
        data: {
          title: 'Produtos mais vendidos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Produtos mais vendidos' },
          ],
        },
      },
      {
        path: 'newCustomersPerSellers',
        component: NewCustomersPerSellersComponent,
        data: {
          title: 'Novos Clientes / Vendedor',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Novos Clientes / Vendedor' },
          ],
        },
      },
      {
        path: 'newCustomersPerMonth',
        component: NewCustomersPerMonthComponent,
        data: {
          title: 'Novos Clientes / Mês',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Novos Clientes / Mês' },
          ],
        },
      },
      {
        path: 'salesByManufacturers',
        component: SalesByManufacturersComponent,
        data: {
          title: 'Vendas / Produtos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Vendas / Produtos' },
          ],
        },
      },
      {
        path: 'salesByDayOfWeek',
        component: SalesByDayOfWeekComponent,
        data: {
          title: 'Vendas / Dia da Semana',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Vendas / Dia da Semana' },
          ],
        },
      },
      {
        path: 'salesByMonth',
        component: SalesByMonthComponent,
        data: {
          title: 'Vendas / Mês',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Vendas / Mês' },
          ],
        },
      },
      {
        path: 'salesByStates',
        component: SalesByStatesComponent,
        data: {
          title: 'Vendas / Estado',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Vendas / Estado' },
          ],
        },
      },
      {
        path: 'subGroupsSold',
        component: SubGroupsSoldComponent,
        data: {
          title: 'Vendas / Sub Grupos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Vendas / Sub Grupos' },
          ],
        },
      },
      {
        path: 'marginByProducts',
        component: MarginByProductsComponent,
        data: {
          title: 'Margem / Produtos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Margem / Produtos' },
          ],
        },
      },
      {
        path: 'marginBySubGroups',
        component: MarginBySubGroupsComponent,
        data: {
          title: 'Margem / Sub Grupos',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard' },
            { title: 'Margem / Sub Grupos' },
          ],
        },
      },
    ],
  },
];
