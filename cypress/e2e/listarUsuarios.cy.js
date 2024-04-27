import { faker } from "@faker-js/faker";
import { PaginaPrincipal } from "../support/pages/paginaPrincipal";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("/users");
  });

  let pgPrincipal = new PaginaPrincipal();

  it("Deve retornar listas de usuários", () => {
    cy.get(pgPrincipal.divListaDeUsuarios).should("be.visible");
  });

  it("A lista deve trazer 6 usuários cadastrados", () => {
    cy.log(cy.get(pgPrincipal.divListaDeUsuarios));

    cy.get(pgPrincipal.divListaDeUsuarios).should("have.length", 6);
  });

  it.only("Teste mockado com 12 usuários e 2 páginas", function () {
    cy.fixture("listaDeUsuariosMock.json").then((arquivo) => {
      cy.intercept("GET", "api/v1/users", {
        statusCode: 200,
        body: arquivo,
      }).as("usuarioMockado");
    });
    cy.wait("@usuarioMockado");
    cy.get("[id='userData']").should("have.length", 6);
    cy.get(pgPrincipal.liTextoPaginas).should("have.text", "1 de 2");
  });

  it("Deve apertar o botão ver detalhes", () => {});

  it("Link para atualizar página inicial", () => {
    cy.get(pgPrincipal.anchorRaro).should("be.visible");
  });

  // último teste
  it("Ir para cadastro de usuário", () => {
    cy.get(pgPrincipal.anchorVoltar).should("be.visible");
  });
});
