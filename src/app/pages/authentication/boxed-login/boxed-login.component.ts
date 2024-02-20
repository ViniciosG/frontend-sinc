import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();
  loading: boolean = false;

  constructor(private settings: CoreService,
    private router: Router,
    public authService: AuthService,
    private _snackBar: MatSnackBar
      ) { }

  form = new FormGroup({
    auth: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    this.loading = true
    this.authService.post(this.form.value).subscribe({
      complete: () => {

      },
      error: (data) => {
        if (data.error.message) {
          this._snackBar.open(data.error.message);
        } else {
          this._snackBar.open('Falha na conexão com a internet', '', {
            duration: 2000,
          });
        }
        this.loading = false
      },
      next: (data: any) => {
        // this.authService.login(data.authorization, data.id, data.name, this.form.value.auth, data.access_permissions, data.is_adm)
        this.loading = false
      }

    });
  }
}
