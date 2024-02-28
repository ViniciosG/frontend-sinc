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
    GoalsBySellersComponent
  ],
})
export class SincModule {}
