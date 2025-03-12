// src/app/locais/locais.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaisService } from '../services/locais.service';
import { Local } from '../models/local.model';

@Component({
  selector: 'app-locais',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CommonModule],
  templateUrl: './locais.component.html',
  styleUrls: ['./locais.component.css']
})
export class LocaisComponent implements OnInit {
  locais: Local[] = [];
  mostrarFormulario: boolean = false;
  localEditando: Local = { nome: '', endereco: '' };
  localAtualId: number | null = null;
  mostrarEdicaoForm: boolean = false;

  constructor(private locaisService: LocaisService) {}

  ngOnInit(): void {
    this.carregarLocais();
  }

  carregarLocais(): void {
    this.locaisService.getLocais().subscribe({
      next: (locais) => this.locais = locais,
      error: (err) => console.error('Erro ao carregar locais:', err)
    });
  }

  adicionarLocal(): void {
    this.locaisService.addLocal(this.localEditando).subscribe({
      next: () => {
        this.carregarLocais();
        this.mostrarFormulario = false;
        this.resetarFormulario();
      },
      error: (err) => console.error('Erro ao adicionar local:', err)
    });
  }

  deletarLocal(id: number): void {
    this.locaisService.deleteLocal(id).subscribe({
      next: () => {
        this.locais = this.locais.filter(local => local.id !== id);
      },
      error: (err) => console.error('Erro ao deletar local:', err)
    });
  }

  editarLocal(id: number): void {
    this.localAtualId = id;
    const localSelecionado = this.locais.find(l => l.id === id);

    if (localSelecionado) {
      this.localEditando = { ...localSelecionado };
      this.mostrarEdicaoForm = true;
    }
  }

  confirmarEdicao(): void {
    if (this.localAtualId !== null) {
      this.locaisService.updateLocal(this.localAtualId, this.localEditando)
        .subscribe({
          next: () => {
            this.carregarLocais();
            this.cancelarEdicao();
          },
          error: (err) => console.error('Erro ao atualizar local:', err)
        });
    }
  }

  cancelarEdicao(): void {
    this.resetarFormulario();
    this.localAtualId = null;
    this.mostrarEdicaoForm = false;
  }

  resetarFormulario(): void {
    this.localEditando = { nome: '', endereco: '' };
  }

  exibirFormulario(): void {
    this.resetarFormulario();
    this.mostrarFormulario = true;
  }
}