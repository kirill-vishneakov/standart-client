import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-appointments-mine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './appointments-mine.component.html',
  styleUrls: ['./appointments-mine.component.scss'],
})
export class AppointmentsMineComponent implements OnInit {
  http = inject(HttpClient);
  auth = inject(AuthService);

  appointments: any[] = [];
  loading = true;

  statuses = ['all', 'scheduled', 'completed', 'canceled'];
  selectedStatus = 'all';

  statusMap: Record<string, string> = {
    scheduled: 'Запланирована',
    completed: 'Завершена',
    canceled: 'Отменена',
  };

  reschedulingId: number | null = null;
  selectedSlotId: number | null = null;
  slots: any[] = [];

  get filteredAppointments() {
    if (this.selectedStatus === 'all') return this.appointments;
    return this.appointments.filter((a) => a.status === this.selectedStatus);
  }

  ngOnInit(): void {
    this.http
      .get<any[]>('https://standart-server.onrender.com/appointments/mine')
      .subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки записей', err);
          this.loading = false;
        },
      });
  }

  cancel(id: number): void {
    if (!confirm('Отменить запись?')) return;

    this.http
      .patch(
        `https://standart-server.onrender.com/appointments/${id}/cancel`,
        {},
      )
      .subscribe({
        next: () => {
          this.appointments = this.appointments.map((a) =>
            a.id === id ? { ...a, status: 'canceled' } : a,
          );
        },
        error: (err) => console.error('Ошибка отмены', err),
      });
  }

  isClient(): boolean {
    return this.auth.currentUser?.role === 'client';
  }

  loadAvailableSlots(): void {
    this.http
      .get<any[]>('https://standart-server.onrender.com/schedule/available')
      .subscribe({
        next: (data) => (this.slots = data),
        error: (err) => console.error('Ошибка загрузки слотов', err),
      });
  }

  reschedule(appointmentId: number): void {
    if (!this.selectedSlotId) return;

    this.http
      .patch(
        `https://standart-server.onrender.com/appointments/${appointmentId}/reschedule`,
        {
          new_slot_id: this.selectedSlotId,
        },
      )
      .subscribe({
        next: () => {
          // Обновляем локальный статус
          const appt = this.appointments.find((a) => a.id === appointmentId);
          const newSlot = this.slots.find((s) => s.id === this.selectedSlotId);
          if (appt && newSlot) {
            appt.date_time = newSlot.start_time;
            appt.employee = newSlot.employee;
          }

          this.reschedulingId = null;
          this.selectedSlotId = null;
        },
        error: (err) => console.error('Ошибка переноса записи:', err),
      });
  }
}
