import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms'; // Adicione esta importação
interface Compromisso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  contatoId: number;
  localId: number;
  usuarioId: number; // Para identificar o dono do compromisso
  }

@Component({
  selector: 'app-compromissos',
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './compromissos.component.html',
  styleUrl: './compromissos.component.css'
})



export class CompromissosComponent {
  compromissos: Compromisso[] = [
    { id: 1, titulo: 'Reunião de Equipe', descricao: 'Discutir novas funcionalidades', data: '2023-07-05', hora: '10:00', contatoId: 1, localId: 1, usuarioId: 1 },
    { id: 2, titulo: 'Reunião de Equipe', descricao: 'Discutir novas funcionalidades', data: '2023-07-05', hora: '10:00', contatoId: 1, localId: 1, usuarioId: 1 },
  ];

  mostrar:boolean = false;


  compromissoEditando: Compromisso = {
    id: 0, // ou undefined se preferir
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    contatoId: 0,
    localId: 0,
    usuarioId: 0
  };

  compromissoAtualId: number | null = null;
  mostrarEdicaoForm: boolean = false;



  adicionarCompromisso() {
    const novoCompromisso: Compromisso = {
      id: this.compromissos.length + 1,
      titulo: 'Novo Compromisso',
      descricao: 'Descrição do novo compromisso',
      data: '2023-07-05',
      hora: '10:00',
      contatoId: 1,
      localId: 1,
      usuarioId: 1
    };
    this.compromissos.push(novoCompromisso);
  }

  mostrarFormulario(){
    this.mostrar = !this.mostrar
  }

  deletarCompromisso(id: number) {
    this.compromissos = this.compromissos.filter(compromisso => compromisso.id !== id);
  }

  editarCompromisso(id: number) {
    this.compromissoAtualId = id;
    const compromissoSelecionado = this.compromissos.find(c => c.id === id);

    if (compromissoSelecionado) {
      // Criamos uma cópia para evitar edição direta antes da confirmação
      this.compromissoEditando = { ...compromissoSelecionado };
      this.mostrarEdicaoForm = true;
    }
  }


  confirmarEdicao() {
    if (this.compromissoEditando && this.compromissoAtualId !== null) {
      const index = this.compromissos.findIndex(c => c.id === this.compromissoAtualId);

      if (index !== -1) {
        this.compromissos[index] = { ...this.compromissoEditando };
      }

      this.compromissoEditando ;
      this.compromissoAtualId = null;
      this.mostrarEdicaoForm = false;
    }
  }

  cancelarEdicao() {
    this.compromissoEditando ;
    this.compromissoAtualId = null;
    this.mostrarEdicaoForm = false;
  }






}
