import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {

  loginForm: FormGroup = this._fb.group({
    Username: [null, [Validators.required]],
    Password: [null, [Validators.required]]
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {}

  submit(): void {
    if (this.loginForm.invalid) return;

    this._authService.login(
      this.loginForm.value.Username,
      this.loginForm.value.Password
    ).subscribe({
      next: () => {
        const role = this._authService.getRole();
        if (role === 'Admin') {
          this._router.navigate(['/admin/home']);
        } else if (role === 'User') {
          this._router.navigate(['/user/home']);
        }
      },
      error: () => {
        alert('Wrong credentials');
        this.loginForm.reset();
      }
    });
  }
}