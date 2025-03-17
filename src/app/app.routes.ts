import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CompromissosComponent } from './compromissos/compromissos.component';
import { ContatosComponent } from './contatos/contatos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LocaisComponent } from './locais/locais.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'compromissos', 
    component: CompromissosComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'contatos', 
    component: ContatosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, AdminGuard] // Apenas administradores podem acessar
  },
  {
    path: 'locais',
    component: LocaisComponent,
    canActivate: [AuthGuard, AdminGuard] // Apenas administradores podem acessar
  },
  { 
    path: '', 
    redirectTo: 'compromissos', 
    pathMatch: 'full' 
  },
  {
    path: '**',
    redirectTo: 'compromissos'
  }
];