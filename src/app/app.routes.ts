import { Routes } from '@angular/router';
import { CompromissosComponent } from './compromissos/compromissos.component';
import { LocaisComponent } from './locais/locais.component';
import { ContatosComponent } from './contatos/contatos.component';
export const routes: Routes = [
{
  path:'',
  redirectTo: 'compromissos',
  pathMatch: 'full'
},
{
  path: 'compromissos',
  component: CompromissosComponent
},
{
  path: 'locais',
  component: LocaisComponent
},
{
  path: 'contatos',
  component: ContatosComponent
}
];
