import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { generateEmployeeReportPDF } from '../../utils/pdf-report.util';

@Component({
  selector: 'app-report-employee',
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
  templateUrl: './report-employee.component.html',
  styleUrls: ['./report-employee.component.scss']
})
export class ReportEmployeeComponent implements OnInit {
  private http = inject(HttpClient);

  employees: any[] = [];
  selectedEmployeeId: number | null = null;
  selectedDate: Date | null = null;
  selectedPeriod: 'month' | 'quarter' | 'year' = 'month';
  report: any = null;
  loading = false;
  reportPeriodLabel: string = '';

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/users/employees').subscribe({
      next: data => this.employees = data,
      error: err => console.error('Ошибка загрузки сотрудников', err)
    });
  }

  loadReport(): void {
    if (!this.selectedEmployeeId || !this.selectedDate) {
      console.error('Выберите сотрудника и дату');
      return;
    }

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();

    let startDate: Date;
    let endDate: Date;

    switch (this.selectedPeriod) {
      case 'month':
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0);
        this.reportPeriodLabel = `${year}-${(month + 1).toString().padStart(2, '0')}`;
        break;
      case 'quarter':
        const quarter = Math.floor(month / 3);
        startDate = new Date(year, quarter * 3, 1);
        endDate = new Date(year, quarter * 3 + 3, 0);
        this.reportPeriodLabel = `${year}-Q${quarter + 1}`;
        break;
      case 'year':
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 12, 0);
        this.reportPeriodLabel = `${year}`;
        break;
      default:
        return;
    }

    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    this.loading = true;
    this.http.get<any>(`http://localhost:5000/reports/employee/${this.selectedEmployeeId}?start=${startStr}&end=${endStr}`)
      .subscribe({
        next: (data) => {
          this.report = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки отчёта', err);
          this.loading = false;
        }
      });
  }

  downloadPDF(): void {
    if (!this.report) {
      console.error('Отчёт не загружен');
      return;
    }

    generateEmployeeReportPDF(this.report, this.reportPeriodLabel);
  }
}
