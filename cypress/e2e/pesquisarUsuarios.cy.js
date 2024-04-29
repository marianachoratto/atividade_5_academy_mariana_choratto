import { faker } from "@faker-js/faker";
import { PaginaPrincipal } from "../support/pages/paginaPrincipal";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("/users");
    cy.intercept("GET", "/api/v1/search?value=*").as("getPesquisa");
  });

  let pgPrincipal = new PaginaPrincipal();
  let nomeUser;

  it("A barra de pesquisa existe e funciona", function () {
    cy.get("input").should("exist");
    cy.get("input").should("be.enabled");
  });

  it.only("Pesquisar usuário pelo nome", () => {
    cy.cadastrarUsuário().then(function (resposta) {
      nomeUser = resposta.nome;

      cy.get("input").type(nomeUser);
      cy.get(pgPrincipal.divListaDeUsuarios);
    });
  });

  it("Pesquisar usuário pelo email", () => {});

  describe("Listagem de usuário com erros", () => {
    it("Deve ser encontrado um usuário através de seu ID", () => {});

    it("Não deverá pesquisar se não houver nada escrito na barra de pesquisa", function () {});
    it("Deve receber 404 com id inexistente", () => {});

    it("Deve receber 500 se...?", () => {});
  });
});
