export class Contato {
  id?: number;
  nome: string;
  telefone: string;
  email: string;

  constructor(nome: string = '', telefone: string = '', email: string = '') {
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
  }
}