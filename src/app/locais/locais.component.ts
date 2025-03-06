import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Local {
  id: number;
  nome: string;
  endereco: string;
}

@Component({
  selector: 'app-locais',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './locais.component.html',
  styleUrl: './locais.component.css'
})
export class LocaisComponent {
  locais: Local[] = [
    { id: 1, nome: 'Escritório Central', endereco: 'Rua A, 123' },
    { id: 2, nome: 'Auditório Principal', endereco: 'Avenida B, 456' }
  ];

  mostrar: boolean = false;

  localEditando: Local = {
    id: 0,
    nome: '',
    endereco: ''
  };

  localAtualId: number | null = null;
  mostrarEdicaoForm: boolean = false;

  adicionarLocal() {
    const novoLocal: Local = {
      id: this.locais.length + 1,
      nome: 'Novo Local',
      endereco: 'Endereço Padrão'
    };
    this.locais.push(novoLocal);
  }

  mostrarFormulario() {
    this.mostrar = !this.mostrar;
  }

  deletarLocal(id: number) {
    this.locais = this.locais.filter(local => local.id !== id);
  }

  editarLocal(id: number) {
    this.localAtualId = id;
    const localSelecionado = this.locais.find(l => l.id === id);

    if (localSelecionado) {
      this.localEditando = { ...localSelecionado };
      this.mostrarEdicaoForm = true;
    }
  }

  confirmarEdicao() {
    if (this.localEditando && this.localAtualId !== null) {
      const index = this.locais.findIndex(l => l.id === this.localAtualId);

      if (index !== -1) {
        this.locais[index] = { ...this.localEditando };
      }

      this.localEditando;
      this.localAtualId = null;
      this.mostrarEdicaoForm = false;
    }
  }

  cancelarEdicao() {
    this.localEditando;
    this.localAtualId = null;
    this.mostrarEdicaoForm = false;
  }
}
