import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { GoalsBySellersComponent } from './goals-by-sellers/goals-by-sellers.component';
import { NewCustomersPerMonthComponent } from './new-customers-per-month/new-customers-per-month.component';
import { NewCustomersPerSellersComponent } from './new-customers-per-sellers/new-customers-per-sellers.component';
import { ProductsSoldComponent } from './products-sold/products-sold.component';
import { SalesByDayOfWeekComponent } from './sales-by-day-of-week/sales-by-day-of-week.component';
import { SalesByManufacturersComponent } from './sales-by-manufacturers/sales-by-manufacturers.component';
import { SalesByMonthComponent } from './sales-by-month/sales-by-month.component';
import { SincRoutes } from './sinc.routing';

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
    SalesByMonthComponent
  ],
})
export class SincModule {}
