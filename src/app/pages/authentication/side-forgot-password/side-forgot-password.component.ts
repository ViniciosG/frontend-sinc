import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-side-forgot-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './side-forgot-password.component.html',
})
export class AppSideForgotPasswordComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    this.router.navigate(['/dashboards/dashboard1']);
  }
}
