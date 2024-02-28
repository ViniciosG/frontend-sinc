import { Routes } from '@angular/router';

import { AppBoxedLoginComponent } from './boxed-login/boxed-login.component';
import { AppErrorComponent } from './error/error.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      // {
      //   path: 'boxed-forgot-pwd',
      //   component: AppBoxedForgotPasswordComponent,
      // },
      {
        path: 'login',
        component: AppBoxedLoginComponent,

      },
      // {
      //   path: 'boxed-register',
      //   component: AppBoxedRegisterComponent,
      // },
      // {
      //   path: 'boxed-two-steps',
      //   component: AppBoxedTwoStepsComponent,
      // },
      {
        path: 'error',
        component: AppErrorComponent,
      },
      // {
      //   path: 'maintenance',
      //   component: AppMaintenanceComponent,
      // },
      // {
      //   path: 'side-forgot-pwd',
      //   component: AppSideForgotPasswordComponent,
      // },
      // {
      //   path: 'side-login',
      //   component: AppSideLoginComponent,
      // },
      // {
      //   path: 'side-register',
      //   component: AppSideRegisterComponent,
      // },
      // {
      //   path: 'side-two-steps',
      //   component: AppSideTwoStepsComponent,
      // },
    ],
  },
];
