import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { inject } from '@angular/core';

// Usando a nova sintaxe de Guards funcional do Angular 15+
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Salvar URL atual para redirecionamento após login
  authService.saveReturnUrl(state.url);
  
  router.navigate(['/login']);
  return false;
};

// Implementação do AdminGuard como função
export const AdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    // Não autenticado - redirecionar para login
    authService.saveReturnUrl(state.url);
    router.navigate(['/login']);
    return false;
  }
  
  // Autenticado mas não é admin - redirecionar para página principal
  router.navigate(['/compromissos']);
  return false;
};