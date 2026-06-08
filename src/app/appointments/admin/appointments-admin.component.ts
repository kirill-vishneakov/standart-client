import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-appointments-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  templateUrl: './appointments-admin.component.html',
  styleUrls: ['./appointments-admin.component.scss'],
})
export class AppointmentsAdminComponent implements OnInit {
  http = inject(HttpClient);
  appointments: any[] = [];
  statuses = ['all', 'scheduled', 'completed', 'canceled'];
  selectedStatus = 'all';
  loading = true;

  statusMap: Record<string, string> = {
    scheduled: 'Запланирована',
    completed: 'Завершена',
    canceled: 'Отменена'
  };

  selectedEmployee: string = 'all';
  selectedDate: Date | null = null;

  get uniqueEmployees(): any[] {
    const seen = new Set();
    return this.appointments
      .map(a => a.employee)
      .filter(e => e && !seen.has(e.id) && seen.add(e.id));
  }


  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/appointments').subscribe({
      next: data => {
        this.appointments = data;
        this.loading = false;
      },
      error: err => {
        console.error('Ошибка загрузки записей', err);
        this.loading = false;
      }
    });
  }

  get filteredAppointments(): any[] {

    return this.appointments.filter(a => {
      const statusMatch = this.selectedStatus === 'all' || a.status === this.selectedStatus;
      const employeeMatch = this.selectedEmployee === 'all' || a.employee?.id === +this.selectedEmployee;
      const dateMatch = !this.selectedDate || a.date_time.startsWith(this.selectedDate.toISOString().slice(0, 10));
      return statusMatch && employeeMatch && dateMatch;
    });
  }


  updateAppointmentStatus(id: number, status: string): void {
    if (!confirm(`Изменить статус на: ${this.statusMap[status] || status}?`)) return;

    this.http.patch(`http://localhost:5000/appointments/${id}/status`, { status }).subscribe({
      next: () => {
        const appt = this.appointments.find(a => a.id === id);
        if (appt) appt.status = status;
      },
      error: err => console.error('Ошибка изменения статуса', err)
    });
  }

}
