import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompromissosService } from '../services/compromissos.service';
import { ContatosService } from '../services/contatos.service';
import { LocaisService } from '../services/locais.service';
import { Compromisso } from '../models/compromisso.model';
import { Contato } from '../models/contato.model';
import { Local } from '../models/local.model';

@Component({
  selector: 'app-compromissos',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CommonModule],
  templateUrl: './compromissos.component.html',
  styleUrls: ['./compromissos.component.css']
})
export class CompromissosComponent implements OnInit {
  compromissos: Compromisso[] = [];
  contatos: Contato[] = [];
  locais: Local[] = [];
  mostrarFormulario: boolean = false;
  compromissoEditando: Compromisso = { 
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

  constructor(
    private compromissosService: CompromissosService,
    private contatosService: ContatosService,
    private locaisService: LocaisService
  ) {}

  ngOnInit(): void {
    this.carregarCompromissos();
    this.carregarContatos();
    this.carregarLocais();
  }

  carregarCompromissos(): void {
    this.compromissosService.getCompromissos().subscribe({
      next: (compromissos) => this.compromissos = compromissos,
      error: (err) => console.error('Erro ao carregar compromissos:', err)
    });
  }

  carregarContatos(): void {
    this.contatosService.getContatos().subscribe({
      next: (contatos) => this.contatos = contatos,
      error: (err) => console.error('Erro ao carregar contatos:', err)
    });
  }

  carregarLocais(): void {
    this.locaisService.getLocais().subscribe({
      next: (locais) => this.locais = locais,
      error: (err) => console.error('Erro ao carregar locais:', err)
    });
  }

  adicionarCompromisso(): void {
    this.compromissosService.addCompromisso(this.compromissoEditando).subscribe({
      next: () => {
        this.carregarCompromissos();
        this.mostrarFormulario = false;
        this.resetarFormulario();
      },
      error: (err) => console.error('Erro ao adicionar compromisso:', err)
    });
  }

  deletarCompromisso(id: number): void {
    this.compromissosService.deleteCompromisso(id).subscribe({
      next: () => {
        this.compromissos = this.compromissos.filter(compromisso => compromisso.id !== id);
      },
      error: (err) => console.error('Erro ao deletar compromisso:', err)
    });
  }

  editarCompromisso(id: number): void {
    this.compromissoAtualId = id;
    const compromissoSelecionado = this.compromissos.find(c => c.id === id);

    if (compromissoSelecionado) {
      this.compromissoEditando = { ...compromissoSelecionado };
      this.mostrarEdicaoForm = true;
    }
  }

  confirmarEdicao(): void {
    if (this.compromissoAtualId !== null) {
      this.compromissosService.updateCompromisso(this.compromissoAtualId, this.compromissoEditando)
        .subscribe({
          next: () => {
            this.carregarCompromissos();
            this.cancelarEdicao();
          },
          error: (err) => console.error('Erro ao atualizar compromisso:', err)
        });
    }
  }

  cancelarEdicao(): void {
    this.resetarFormulario();
    this.compromissoAtualId = null;
    this.mostrarEdicaoForm = false;
  }

  resetarFormulario(): void {
    this.compromissoEditando = { 
      titulo: '', 
      descricao: '', 
      data: '', 
      hora: '', 
      contatoId: 0, 
      localId: 0, 
      usuarioId: 0 
    };
  }

  exibirFormulario(): void {
    this.resetarFormulario();
    this.mostrarFormulario = true;
  }

  // Método para obter o nome do contato pelo ID
  getNomeContato(id: number): string {
    const contato = this.contatos.find(c => c.id === id);
    return contato ? contato.nome : 'Contato não encontrado';
  }

  // Método para obter o nome do local pelo ID
  getNomeLocal(id: number): string {
    const local = this.locais.find(l => l.id === id);
    return local ? local.nome : 'Local não encontrado';
  }

  // Neste exemplo, todos podem editar os compromissos
  podeEditarCompromisso(compromisso: Compromisso): boolean {
    return true;
  }
}
