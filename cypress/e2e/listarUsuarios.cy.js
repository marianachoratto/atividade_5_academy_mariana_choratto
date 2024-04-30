import { faker } from "@faker-js/faker";
import { PaginaPrincipal } from "../support/pages/paginaPrincipal";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("/users");
  });

  let pgPrincipal = new PaginaPrincipal();
  const urlCadastroUsuario =
    "https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo";

  describe("Testes de funcionamento da página", function () {
    it("Deve retornar cards dos usuários", () => {
      cy.get(pgPrincipal.divListaDeUsuarios).should("be.visible");
    });

    it("Apertar o botão ver detalhes deve levar o usuário para outra página", () => {
      let idUsuario;
      let name = faker.person.fullName();
      let email = faker.internet.email();

      cy.request("POST", "rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users", {
        name: name,
        email: email,
      }).then(function (resposta) {
        cy.intercept("GET", "api/v1/users", {
          statusCode: 200,
          body: [
            {
              id: resposta.body.id,
              name: name,
              email: email,
              createdAt: "2024-04-27T20:56:45.656Z",
              updatedAt: "2024-04-27T20:56:45.656Z",
            },
          ],
        }).as("getUsers");

        cy.wait("@getUsers").then((intercept) => {
          cy.get(pgPrincipal.anchorVerDetalhes).click();
          idUsuario = intercept.response.body[0].id;
          cy.url().should(
            "equal",
            `https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/${idUsuario}`
          );
        });
      });
    });

    it("Link para atualizar página inicial", () => {
      cy.get(pgPrincipal.anchorRaro).should("be.visible");
      cy.get(pgPrincipal.anchorRaro).click();
      cy.url().should(
        "equal",
        "https://rarocrud-frontend-88984f6e4454.herokuapp.com/users"
      );
    });

    it("Ir para cadastro de usuário", () => {
      cy.get(pgPrincipal.anchorVoltar).should("be.visible");
      cy.get(pgPrincipal.anchorVoltar).click();
      cy.url().should("equal", urlCadastroUsuario);
    });
  });

  // Fazer mais testes
  describe.only("Teste mockado com 6 usuários no banco de dados", function () {
    it("A lista deve trazer 6 usuários cadastrados", () => {
      cy.intercept("GET", "/api/v1/users", {
        statusCode: 200,
        fixture: "lista6Usuarios.json",
      }).as("mockTeste");

      cy.wait("@mockTeste");
      cy.log(cy.get(pgPrincipal.divListaDeUsuarios));

      cy.get(pgPrincipal.divListaDeUsuarios).should("have.length", 6);
    });
  });

  describe("Teste mockado com 2 usuários no banco de dados", function () {
    beforeEach(function () {
      cy.intercept("GET", "api/v1/users", {
        statusCode: 200,
        fixture: "lista2Usuarios.json",
      }).as("pequenaListaDeUsuarios");
    });

    it("Quando vier 2 usuários aparecerá 2 cards apenas", () => {
      cy.wait("@pequenaListaDeUsuarios");
      cy.get("[id='userData']").should("have.length", 2);
      cy.get(pgPrincipal.liTextoPaginas)
        .invoke("text")
        .should("be.equal", "1 de 1");
      cy.contains("Nome:").invoke("text").should("be.equal", "Nome: Yvette");
      cy.contains("E-mail:")
        .invoke("text")
        .should("be.equal", "E-mail: hassan68@hotmail.com");
    });

    it("Os botões estarão desabilitados", function () {
      cy.wait("@pequenaListaDeUsuarios");
      cy.get(pgPrincipal.paginaAnterior).should("be.disabled");
      cy.get(pgPrincipal.paginaProxima).should("be.disabled");
    });
  });

  describe("Teste mockado com 12 usuários e 2 páginas", function () {
    beforeEach(function () {
      cy.intercept("GET", "api/v1/users", {
        statusCode: 200,
        fixture: "listaDeUsuariosMock.json",
      }).as("usuarioMockado");
    });

    it("Quando houver 12 usuários o site deverá ter 2 páginas", function () {
      cy.wait("@usuarioMockado");
      cy.get("[id='userData']").should("have.length", 6);
      cy.get(pgPrincipal.liTextoPaginas).should("have.text", "1 de 2");
    });

    it("O botão de paginação 'Anterior' estará desabilitado e 'Próxima' estará habilitado", function () {
      cy.wait("@usuarioMockado");
      cy.get(pgPrincipal.paginaAnterior).should("be.disabled");
      cy.get(pgPrincipal.paginaProxima).should("be.enabled");
    });

    it("A página 2 deverá trazer os usuários de 7 a 12", function () {
      cy.wait("@usuarioMockado");
      cy.get(pgPrincipal.paginaProxima).click();
      cy.get(pgPrincipal.liTextoPaginas).should("have.text", "2 de 2");
    });
  });

  describe("Teste mockado com 0 usuários", function () {
    beforeEach(function () {
      cy.intercept("GET", "api/v1/users", {
        statusCode: 200,
      }).as("noUsers");
    });

    it("Não aparecerá os elementos dos usuários quando não houver nenhum usuário", () => {
      cy.wait("@noUsers");
      cy.contains(
        "h3",
        "Ops! Não existe nenhum usuário para ser exibido."
      ).should("be.visible");
      cy.contains("p", "Cadastre um novo usuário").should("be.visible");
      cy.get(pgPrincipal.divDadosUsuarios).should("not.exist");
    });

    it("O link de cadastrar novo usuário deverá levar até a página de cadastro", function () {
      cy.wait("@noUsers");
      cy.contains("p", "Cadastre um novo usuário").click();
      cy.url().should("equal", urlCadastroUsuario);
    });
  });
});
