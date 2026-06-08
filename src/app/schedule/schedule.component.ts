import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  http = inject(HttpClient);
  slots: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.http
      .get<any[]>('https://standart-server.onrender.com/schedule/available')
      .subscribe({
        next: (data) => {
          this.slots = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки расписания', err);
          this.loading = false;
        },
      });
  }
}
