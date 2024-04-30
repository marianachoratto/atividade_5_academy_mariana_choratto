import { faker } from "@faker-js/faker";
import { PaginaDetalhes } from "../support/pages/PaginaDetalhes";

// Ver como colocar o id do usuário no before each

describe("Testes de usuário na página de detalhes", () => {
  let pageObjects = new PaginaDetalhes();
  let userId;
  const novoNome = "Usuário Alterado";
  const novoEmail = "emailalterado@gmail.com";

  beforeEach(() => {
    cy.cadastrarUsuário()
      .then(function (resposta) {
        userId = resposta.id;
      })
      .then(function (resposta) {
        cy.visit(`/users/${userId}`);
      });
  });

  afterEach(function () {
    cy.deletarUsuario(userId);
  });

  it.only("Deve conseguir alterar cadastro de usuário", () => {
    cy.intercept("PUT", `/api/v1/users/${userId}`).as("alterarDados");

    cy.get(pageObjects.buttonEditar).click();
    cy.get(pageObjects.InputName).clear();
    pageObjects.mudarNome(novoNome);
    cy.get(pageObjects.InputEmail).clear();
    pageObjects.mudarEmail(novoEmail);
    cy.get(pageObjects.buttonSalvar).click();
    cy.wait("@alterarDados");
    cy.contains("Informações atualizadas com sucesso!").should("exist");
  });

  it("Checando se as alterações foram efetuadas", () => {});

  it("Não deve conseguir alterar os dados do usuário com id não encontrado", function () {});

  it("Deletar usuário", () => {});
});
