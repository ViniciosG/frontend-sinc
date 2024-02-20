import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private settings: CoreService,
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar
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

  submit() {
    // this.loading = true
    // this.authService.signIn(this.form.value).subscribe({
    //   complete: () => {

    //   },
    //   error: (data) => {
    //     if (data.error.message) {
    //       this._snackBar.open(data.error.message);
    //     } else {
    //       this._snackBar.open('Falha na conexão com a internet', '', {
    //         duration: 2000,
    //       });
    //     }
    //     this.loading = false
    //   },
    //   next: (data: any) => {
    //     // this.authService.login(data.authorization, data.id, data.name, this.form.value.auth, data.access_permissions, data.is_adm)
    //     this.loading = false
    //   }

    // });
  }

  authenticationUser() {
    this.authService.signIn(this.form.value);
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
