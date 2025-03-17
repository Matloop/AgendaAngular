import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, tap, throwError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = new JwtHelperService(); // Instanciar diretamente
  private snackBar = inject(MatSnackBar);

  // URLs e constantes
  private apiUrl = 'https://api-users-gdsb.onrender.com';
  private tokenKey = 'access_token';
  
  // Observable para status de autenticação
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor() {
    // Verificar token na inicialização
    this.checkTokenValidity();
    // Verificar a cada minuto
    setInterval(() => this.checkTokenValidity(), 60000);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
          this.authStatusSubject.next(true);
          
          // Notificar sucesso
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          const returnUrl = localStorage.getItem('returnUrl') || '/compromissos';
          localStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
        }
      }),
      catchError(error => {
        let errorMsg = 'Falha na autenticação';
        
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else if (error.status === 401) {
          errorMsg = 'Email ou senha incorretos';
        } else if (error.status === 0) {
          errorMsg = 'Servidor indisponível. Tente novamente mais tarde.';
        }
        
        this.snackBar.open(errorMsg, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  register(user: { name: string; email: string; password: string; role: 'user' | 'admin' }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        this.snackBar.open('Registro realizado com sucesso! Faça login para continuar.', 'Fechar', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        let errorMsg = 'Erro ao registrar usuário';
        
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else if (error.status === 400) {
          errorMsg = 'Dados inválidos ou usuário já existe';
        } else if (error.status === 0) {
          errorMsg = 'Servidor indisponível. Tente novamente mais tarde.';
        }
        
        this.snackBar.open(errorMsg, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
    
    this.snackBar.open('Você foi desconectado com sucesso', 'Fechar', { 
      duration: 3000 
    });
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): UserInfo | null {
    try {
      const token = this.getToken();
      if (token) {
        return this.jwtHelper.decodeToken(token) as UserInfo;
      }
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.logout(); // Token inválido, fazer logout
    }
    return null;
  }

  isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.role === 'admin';
  }

  // Método para salvar URL de retorno
  saveReturnUrl(url: string): void {
    if (url && url !== '/login') {
      localStorage.setItem('returnUrl', url);
    }
  }

  // Métodos privados
  private hasValidToken(): boolean {
    try {
      const token = this.getToken();
      return !!token && !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkTokenValidity(): void {
    const wasAuthenticated = this.authStatusSubject.value;
    const isCurrentlyAuthenticated = this.hasValidToken();
    
    // Atualizar status apenas se houver mudança
    if (wasAuthenticated !== isCurrentlyAuthenticated) {
      this.authStatusSubject.next(isCurrentlyAuthenticated);
      
      // Se token expirou durante a sessão
      if (wasAuthenticated && !isCurrentlyAuthenticated) {
        this.snackBar.open('Sua sessão expirou. Por favor, faça login novamente.', 'Fechar', {
          duration: 5000
        });
        this.router.navigate(['/login']);
      }
    }
  }
}