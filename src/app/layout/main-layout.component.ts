import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    RouterLink
  ]
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router)

  get user() {
    return this.auth.currentUser;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
