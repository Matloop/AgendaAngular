import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContatosService } from '../services/contatos.service';
import { Contato } from '../models/contato.model';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [FormsModule, CommonModule], // Simplificado os imports
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {
  contatos: Contato[] = [];
  mostrar: boolean = false;
  contatoEditando: Contato = { id: 0, nome: '', telefone: '', email: '' };
  contatoAtualId: number | null = null;
  mostrarEdicaoForm: boolean = false;

  constructor(private contatosService: ContatosService) {}

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatosService.getContatos().subscribe({
      next: (contatos) => this.contatos = contatos,
      error: (err) => console.error('Erro ao carregar contatos:', err)
    });
  }

  adicionarContato(novoContato: Contato) {
    // Crie uma cópia para não modificar o objeto de edição diretamente
    const contatoParaAdicionar = {
      nome: novoContato.nome,
      telefone: novoContato.telefone,
      email: novoContato.email
    };
    
    this.contatosService.addContato(contatoParaAdicionar).subscribe({
      next: () => {
        this.carregarContatos();
        this.mostrar = false;
        // Limpar o formulário após adicionar
        this.contatoEditando = { id: 0, nome: '', telefone: '', email: '' };
      },
      error: (err) => console.error('Erro ao adicionar contato:', err)
    });
  }

  deletarContato(id: number) {
    this.contatosService.deleteContato(id).subscribe({
      next: () => {
        this.contatos = this.contatos.filter(contato => contato.id !== id);
      },
      error: (err) => console.error('Erro ao deletar contato:', err)
    });
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
    if (this.contatoAtualId !== null) {
      this.contatosService.updateContato(this.contatoAtualId, this.contatoEditando)
        .subscribe({
          next: () => {
            this.carregarContatos();
            this.cancelarEdicao();
          },
          error: (err) => console.error('Erro ao atualizar contato:', err)
        });
    }
  }

  cancelarEdicao() {
    this.contatoEditando = { id: 0, nome: '', telefone: '', email: '' };
    this.contatoAtualId = null;
    this.mostrarEdicaoForm = false;
  }
}