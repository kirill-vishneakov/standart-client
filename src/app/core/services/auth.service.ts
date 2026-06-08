import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://standart-server.onrender.com/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const { user } = JSON.parse(saved);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.warn('Ошибка при чтении localStorage:', e);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.setSession(res);
        }),
      );
  }

  register(data: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.currentUserSubject.next(null);
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem('auth', JSON.stringify(res));
    this.currentUserSubject.next(res.user);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    const saved = localStorage.getItem('auth');
    try {
      return saved ? JSON.parse(saved).token : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  get role(): string | null {
    return this.currentUser?.role ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.role ?? '');
  }

  getToken(): string | null {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved).token : null;
  }
}
