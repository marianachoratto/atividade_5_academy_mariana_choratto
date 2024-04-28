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

  it("Não aparecerá os elementos dos usuários quando não houver nenhum usuário", () => {
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

  it.only("Apertar o botão ver detalhes deve levar o usuário para outra página", () => {
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
  });

  // último teste
  it("Ir para cadastro de usuário", () => {
    cy.get(pgPrincipal.anchorVoltar).should("be.visible");
  });
});
