import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

@Component({
  selector: 'app-contatos',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './contatos.component.html',
  styleUrl: './contatos.component.css'
})
export class ContatosComponent {
  contatos: Contato[] = [
    { id: 1, nome: 'João Silva', telefone: '123456789', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Souza', telefone: '987654321', email: 'maria@email.com' }
  ];

  mostrar: boolean = false;

  contatoEditando: Contato = {
    id: 0,
    nome: '',
    telefone: '',
    email: ''
  };

  contatoAtualId: number | null = null;
  mostrarEdicaoForm: boolean = false;

  adicionarContato() {
    const novoContato: Contato = {
      id: this.contatos.length + 1,
      nome: 'Novo Contato',
      telefone: '000000000',
      email: 'novo@email.com'
    };
    this.contatos.push(novoContato);
  }

  mostrarFormulario() {
    this.mostrar = !this.mostrar;
  }

  deletarContato(id: number) {
    this.contatos = this.contatos.filter(contato => contato.id !== id);
  }

  editarContato(id: number) {
    this.contatoAtualId = id;
    const contatoSelecionado = this.contatos.find(c => c.id === id);

    if (contatoSelecionado) {
      this.contatoEditando = { ...contatoSelecionado };
      this.mostrarEdicaoForm = true;
    }
  }

  confirmarEdicao() {
    if (this.contatoEditando && this.contatoAtualId !== null) {
      const index = this.contatos.findIndex(c => c.id === this.contatoAtualId);

      if (index !== -1) {
        this.contatos[index] = { ...this.contatoEditando };
      }

      this.contatoEditando;
      this.contatoAtualId = null;
      this.mostrarEdicaoForm = false;
    }
  }

  cancelarEdicao() {
    this.contatoEditando;
    this.contatoAtualId = null;
    this.mostrarEdicaoForm = false;
  }
}
