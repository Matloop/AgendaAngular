import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompromissosComponent } from './compromissos/compromissos.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CompromissosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'agenda-compromissos';
}
