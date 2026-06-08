import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);

  services: any[] = [];
  availableEmployees: any[] = [];
  availableSlots: any[] = [];

  form = this.fb.group({
    service_id: [null, Validators.required],
    employee_id: [null, Validators.required],
    slot_id: [null, Validators.required],
  });

  ngOnInit(): void {
    // Загружаем список услуг
    this.http
      .get('https://standart-server.onrender.com/services')
      .subscribe((data: any) => (this.services = data));
  }

  // Когда выбирается услуга, загружаем доступных работников
  onServiceChange(event: any): void {
    const serviceId = event.value;
    this.http
      .get<
        any[]
      >(`https://standart-server.onrender.com/schedule/available?service_id=${serviceId}`)
      .subscribe((slots) => {
        // Убираем дублирование работников
        const employeesSet = new Set();
        this.availableEmployees = [];
        this.availableSlots = slots.map((slot: any) => {
          if (!employeesSet.has(slot.employee.id)) {
            employeesSet.add(slot.employee.id);
            this.availableEmployees.push(slot.employee);
          }
          return slot;
        });
      });
  }

  // Когда выбирается работник, показываем доступные слоты для него
  onEmployeeChange(): void {
    const employeeId = this.form.get('employee_id')?.value;
    const serviceId = this.form.get('service_id')?.value;

    this.http
      .get<
        any[]
      >(`https://standart-server.onrender.com/schedule/available?employee_id=${employeeId}&service_id=${serviceId}`)
      .subscribe((slots) => {
        this.availableSlots = slots;
      });
  }

  // Отправка формы
  submit(): void {
    if (this.form.invalid || !this.auth.currentUser) return;

    const { service_id, slot_id, employee_id } = this.form.value;
    const client_id = this.auth.currentUser.id;

    this.http
      .post('https://standart-server.onrender.com/appointments', {
        client_id,
        service_id,
        slot_id,
        employee_id,
      })
      .subscribe({
        next: () => this.router.navigate(['/appointments/mine']),
        error: (err) => console.error('Ошибка записи', err),
      });
  }
}
