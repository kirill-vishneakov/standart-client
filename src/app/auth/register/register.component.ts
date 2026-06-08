import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  error: string | null = null;

  form = this.fb.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.required],
    role: ['client', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      console.warn('Форма невалидна', this.form.value);
      return
    }

    const formValue = this.form.value as {
      full_name: string;
      email: string;
      phone: string;
      password: string;
      role: string;
    };

    this.auth.register(formValue).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error?.message || 'Ошибка регистрации'
    });
  }

}
