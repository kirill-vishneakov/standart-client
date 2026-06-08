import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-schedule-available',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    DatePipe,
    CommonModule,
    MatInputModule,
  ],
  templateUrl: 'schedule-available.component.html',
  styleUrl: 'schedule-available.component.scss',
})
export class ScheduleAvailableComponent implements OnInit {
  private http = inject(HttpClient);

  employees: any[] = [];
  selectedEmployeeId: number | null = null;
  selectedDate: Date | null = null;
  slots: any[] = [];

  constructor() {
    this.loadEmployees();
  }

  ngOnInit() {}

  loadEmployees() {
    this.http
      .get<any[]>('https://standart-server.onrender.com/users/employees')
      .subscribe((data) => {
        this.employees = data;
      });
  }

  loadAvailableSlots() {
    if (!this.selectedEmployeeId || !this.selectedDate) {
      console.error('Выберите сотрудника и дату');
      return;
    }

    const date = this.selectedDate.toISOString().slice(0, 10);

    this.http
      .get<
        any[]
      >(`https://standart-server.onrender.com/schedule/available?employee_id=${this.selectedEmployeeId}&date=${date}`)
      .subscribe({
        next: (data) => {
          this.slots = data;
        },
        error: (err) => {
          console.error('Ошибка при загрузке слотов', err);
        },
      });
  }
}
