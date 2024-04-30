export class PaginaDetalhes {
  InputName = "[name='name']";
  InputEmail = "[name='email']";
  InputId = "[name='id']";
  buttonEditar = '[type="button"]';
  buttonSalvar = '[type="submit"]';

  mudarNome(nomeAlterado) {
    cy.get(this.InputName).type(nomeAlterado);
  }

  mudarEmail(emailAlterado) {
    cy.get(this.InputEmail).type(emailAlterado);
  }
}
