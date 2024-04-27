export default class PaginaDeCastrato {
  inputName = "input#name";
  inputEmail = "input#email";
  buttonSave = '[type="submit"]';
  anchorRaro = '[href="/users"]';
  anchorVoltar = "a img";

  typeNome(nome) {
    cy.get(this.inputName).type(nome);
  }

  typeEmail(email) {
    cy.get(this.inputEmail).type(email);
  }

  clickcadastrar() {
    cy.get(this.buttonSave).click();
  }

  voltarPaginaInicial() {
    cy.get(this.anchorVoltar).click();
  }

  voltarLinkRaro() {
    cy.get(this.anchorRaro).click();
  }
}
