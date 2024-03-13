import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FiltersComponent } from './components/filters/filters.component';
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
import { SincRoutes } from './sinc.routing';
import { SubGroupsSoldComponent } from './sub-groups-sold/sub-groups-sold.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SincRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    GoalsBySellersComponent,
    ProductsSoldComponent,
    NewCustomersPerSellersComponent,
    NewCustomersPerMonthComponent,
    SalesByManufacturersComponent,
    SalesByDayOfWeekComponent,
    SalesByMonthComponent,
    SalesByStatesComponent,
    FiltersComponent,
    GoalsBySellersMonthComponent,
    SubGroupsSoldComponent,
    MarginBySubGroupsComponent,
    MarginByProductsComponent,
    NgxEchartsModule.forRoot({
      echarts
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class SincModule {}
