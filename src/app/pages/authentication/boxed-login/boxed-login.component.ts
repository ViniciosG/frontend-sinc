import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();
  loading: boolean = false;
  form: FormGroup;
  authValid: boolean;
  rememberMe: any;
  errorMessage: string = '';

  constructor(private settings: CoreService,
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
      ) {  this.form = this.fb.group({
        auth: ['', Validators.required],
        password: ['', [Validators.required]],
        rememberMe: [false]
      });}
      



  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.form.patchValue({ auth: rememberedUser, rememberMe: true });
    }

    this.authService.isErrorSubject.subscribe((isError) => {
      this.authValid = isError;
    });
  }

  authenticationUser() {
    this.authValid = this.authService.isLoading
    this.authService.signIn(this.form.value);
    this.authValid = this.authService.isLoading

  }

  toggleRememberMe() {
    this.rememberMe = this.form.get('rememberMe');
    if (this.rememberMe.value) {
      localStorage.setItem('rememberedUser', this.form.get('auth')?.value);
    } else {
      localStorage.removeItem('rememberedUser');
    }
  }
}
