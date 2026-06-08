import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

interface Service {
  id: number;
  name: string;
  duration_minutes: number;
  price: number;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: 'services.component.html'
})
export class ServicesComponent implements OnInit {
  http = inject(HttpClient);
  services: Service[] = [];

  ngOnInit(): void {
    this.http.get<Service[]>('http://localhost:5000/services').subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Ошибка загрузки услуг', err)
    });
  }
}
