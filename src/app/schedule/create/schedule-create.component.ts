import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-schedule-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.scss']
})
export class ScheduleCreateComponent implements OnInit {
  http = inject(HttpClient);

  employees: any[] = [];
  selectedEmployeeId: number | null = null;
  weekdays = [
    { name: 'Пн', value: 1, selected: false },
    { name: 'Вт', value: 2, selected: false },
    { name: 'Ср', value: 3, selected: false },
    { name: 'Чт', value: 4, selected: false },
    { name: 'Пт', value: 5, selected: false },
    { name: 'Сб', value: 6, selected: false },
    { name: 'Вс', value: 0, selected: false },
  ];

  startTime: string = '08:00';
  endTime: string = '17:00';
  generateForWeek: boolean = true;

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/users/employees').subscribe(data => {
      this.employees = data;
    });
  }

  generate() {
    const selectedDays = this.weekdays.filter(d => d.selected).map(d => d.value);
    if (!this.selectedEmployeeId || selectedDays.length === 0) {
      alert('Выберите сотрудника и хотя бы один день недели');
      return;
    }

    this.http.post('http://localhost:5000/schedule/generate', {
      employee_id: this.selectedEmployeeId,
      daysOfWeek: selectedDays,
      startTime: this.startTime,
      endTime: this.endTime,
      generateForWeek: this.generateForWeek
    }).subscribe({
      next: () => alert('Расписание создано'),
      error: err => console.error('Ошибка генерации расписания', err)
    });
  }
}
