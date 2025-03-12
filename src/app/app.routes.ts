import { Routes } from '@angular/router';
import { CompromissosComponent } from './compromissos/compromissos.component';
import { ContatosComponent } from './contatos/contatos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LocaisComponent } from './locais/locais.component';

export const routes: Routes = [
  { 
    path: 'compromissos', 
    component: CompromissosComponent 
  },
  { 
    path: 'contatos', 
    component: ContatosComponent 
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'locais',
    component: LocaisComponent
  },
  { 
    path: '', 
    redirectTo: 'compromissos', 
    pathMatch: 'full' 
  }
];