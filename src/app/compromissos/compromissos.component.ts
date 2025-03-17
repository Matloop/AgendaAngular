import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompromissosService } from '../services/compromissos.service';
import { ContatosService } from '../services/contatos.service';
import { LocaisService } from '../services/locais.service';
import { PermissoesService } from '../services/permissoes.service';
import { AuthService } from '../core/auth.service';
import { Compromisso } from '../models/compromisso.model';
import { Contato } from '../models/contato.model';
import { Local } from '../models/local.model';

@Component({
  selector: 'app-compromissos',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    private locaisService: LocaisService,
    private permissoesService: PermissoesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarCompromissos();
    this.carregarContatos();
    this.carregarLocais();
  }

  carregarCompromissos(): void {
    // Se o usuário for admin, carregar todos os compromissos
    // Senão, carregar apenas os compromissos do usuário atual
    if (this.permissoesService.isAdmin()) {
      this.compromissosService.getCompromissos().subscribe({
        next: (compromissos) => this.compromissos = compromissos,
        error: (err) => console.error('Erro ao carregar compromissos:', err)
      });
    } else {
      const userId = this.permissoesService.getCurrentUserId();
      this.compromissosService.getCompromissosByUsuario(userId).subscribe({
        next: (compromissos) => this.compromissos = compromissos,
        error: (err) => console.error('Erro ao carregar compromissos:', err)
      });
    }
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
    if (!this.permissoesService.canCreateCompromisso()) {
      console.error('Sem permissão para criar compromisso');
      return;
    }
    
    // Definir o usuário atual como proprietário do compromisso
    this.compromissoEditando.usuarioId = this.permissoesService.getCurrentUserId();
    
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
    const compromisso = this.compromissos.find(c => c.id === id);
    if (!compromisso) return;
    
    if (!this.permissoesService.canDeleteCompromisso(compromisso)) {
      console.error('Sem permissão para deletar este compromisso');
      return;
    }
    
    this.compromissosService.deleteCompromisso(id).subscribe({
      next: () => {
        this.compromissos = this.compromissos.filter(compromisso => compromisso.id !== id);
      },
      error: (err) => console.error('Erro ao deletar compromisso:', err)
    });
  }

  editarCompromisso(id: number): void {
    const compromissoSelecionado = this.compromissos.find(c => c.id === id);
    if (!compromissoSelecionado) return;
    
    if (!this.permissoesService.canEditCompromisso(compromissoSelecionado)) {
      console.error('Sem permissão para editar este compromisso');
      return;
    }
    
    this.compromissoAtualId = id;
    this.compromissoEditando = { ...compromissoSelecionado };
    this.mostrarEdicaoForm = true;
  }

  confirmarEdicao(): void {
    if (this.compromissoAtualId !== null) {
      // Verificar novamente as permissões
      const compromisso = this.compromissos.find(c => c.id === this.compromissoAtualId);
      if (!compromisso || !this.permissoesService.canEditCompromisso(compromisso)) {
        console.error('Sem permissão para editar este compromisso');
        return;
      }
      
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
    if (!this.permissoesService.canCreateCompromisso()) {
      console.error('Sem permissão para criar compromisso');
      return;
    }
    
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

  // Método para verificar se o usuário pode editar o compromisso
  podeEditarCompromisso(compromisso: Compromisso): boolean {
    return this.permissoesService.canEditCompromisso(compromisso);
  }
  
  // Método para verificar se o usuário pode deletar o compromisso
  podeDeletarCompromisso(compromisso: Compromisso): boolean {
    return this.permissoesService.canDeleteCompromisso(compromisso);
  }
  
  // Método para verificar se o usuário pode criar compromisso
  podeCriarCompromisso(): boolean {
    return this.permissoesService.canCreateCompromisso();
  }
}