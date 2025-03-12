import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compromisso } from '../models/compromisso.model';

@Injectable({
  providedIn: 'root'
})
export class CompromissosService {
  private apiUrl = 'http://localhost:3001/compromissos';

  constructor(private http: HttpClient) { }

  getCompromissos(): Observable<Compromisso[]> {
    return this.http.get<Compromisso[]>(this.apiUrl);
  }

  getCompromissosByUsuario(usuarioId: number): Observable<Compromisso[]> {
    return this.http.get<Compromisso[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  getCompromisso(id: number): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`);
  }

  addCompromisso(compromisso: Compromisso): Observable<Compromisso> {
    return this.http.post<Compromisso>(this.apiUrl, compromisso);
  }

  updateCompromisso(id: number, compromisso: Compromisso): Observable<Compromisso> {
    return this.http.put<Compromisso>(`${this.apiUrl}/${id}`, compromisso);
  }

  deleteCompromisso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}