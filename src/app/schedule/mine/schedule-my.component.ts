import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './schedule-my.component.html',
  styleUrl: './schedule-my.component.scss'
})
export class ScheduleMyComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  slots: any[] = [];
  grouped: Record<string, any[]> = {};
  weekDays: Date[] = [];

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.http.get<any[]>('http://localhost:5000/schedule/my').subscribe({
      next: (data) => {
        this.slots = data;
        this.groupSlotsByDate();
      },
      error: (err) => console.error('Ошибка загрузки расписания:', err)
    });
  }

  groupSlotsByDate(): void {
    this.grouped = {};
    this.weekDays = [];

    for (const slot of this.slots) {
      const date = slot.start_time.split('T')[0];

      if (!this.grouped[date]) {
        this.grouped[date] = [];
        this.weekDays.push(new Date(date));
      }

      this.grouped[date].push(slot);
    }

    // Сортировка дней недели
    this.weekDays.sort((a, b) => a.getTime() - b.getTime());
  }

  getSlotsByDay(day: Date): any[] {
    const key = day.toISOString().split('T')[0];
    return this.grouped[key] || [];
  }
}
