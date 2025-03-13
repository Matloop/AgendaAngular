import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);
  private snackBar = inject(MatSnackBar);

  // Keep hardcoded values in the service
  private apiUrl = 'https://api-users-gdsb.onrender.com';
  private tokenKey = 'access_token';
  
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor() {
    this.checkTokenExpiration();
    // Set up a timer to periodically check token expiration
    setInterval(() => this.checkTokenExpiration(), 60000); // Check every minute
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.authStatus.next(true);
        this.router.navigate(['/compromissos']);
      }),
      catchError(error => {
        this.handleError('Erro no login', error);
        return throwError(() => error);
      })
    );
  }

  register(user: { name: string; email: string; password: string; role: 'user' | 'admin' }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        this.snackBar.open('Registro realizado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.handleError('Erro no registro', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  get authState(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token && this.jwtHelper.isTokenExpired(token)) {
      this.snackBar.open('Sua sessão expirou. Por favor, faça login novamente.', 'Fechar', {
        duration: 5000
      });
      this.logout();
    }
  }

  private handleError(message: string, error: any): void {
    console.error('Auth error:', error);
    
    let errorMsg = message;
    if (error.error?.message) {
      errorMsg = error.error.message;
    } else if (error.status === 401) {
      errorMsg = 'Credenciais inválidas';
    } else if (error.status === 0) {
      errorMsg = 'Erro na comunicação com o servidor';
    }
    
    this.snackBar.open(errorMsg, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}