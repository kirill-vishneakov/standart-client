import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export function roleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.currentUser;
    const currentRole = user?.role;

    if (!currentRole || !expectedRoles.includes(currentRole)) {
      router.navigate(['/unauthorized']);  // редиректим на страницу с ошибкой
      return false;
    }

    return true;
  };
}
