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

  it("Quando vier menos de 6 usuários aparecerá menos de 6 elementos de usuários", () => {
    cy.intercept("GET", "api/v1/users", {
      statusCode: 200,
      fixture: "lista2Usuarios.json",
    }).as("pequenaListaDeUsuarios");

    cy.wait("@pequenaListaDeUsuarios");
    cy.get("[id='userData']").should("have.length", 2);
    cy.get(pgPrincipal.liTextoPaginas)
      .invoke("text")
      .should("be.equal", "1 de 1");
  });

  it("Teste mockado com 12 usuários e 2 páginas", function () {
    cy.intercept("GET", "api/v1/users", {
      statusCode: 200,
      fixture: "listaDeUsuariosMock.json",
    }).as("usuarioMockado");

    cy.wait("@usuarioMockado");
    cy.get("[id='userData']").should("have.length", 6);
    cy.get(pgPrincipal.liTextoPaginas).should("have.text", "1 de 2");
  });

  it.only("Não aparecerá os elementos dos usuários quando não houver nenhum usuário", () => {
    cy.intercept("GET", "api/v1/users", {
      statusCode: 200,
    }).as("noUsers");

    cy.wait("@noUsers");
    cy.contains(
      "h3",
      "Ops! Não existe nenhum usuário para ser exibido."
    ).should("be.visible");
    cy.contains("p", "Cadastre um novo usuário").should("be.visible");
    cy.get(pgPrincipal.divDadosUsuarios).should("have.length", 0);
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
