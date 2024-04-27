import { faker } from "@faker-js/faker";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("Deve verificar se existe um link para a lista de usuários", () => {
    cy.visit("https://example.cypress.io");
  });

  it("Deve retornar listas de usuários", () => {});

  it("Deve apertar o botão ver detalhes", () => {});

  it("Atualizar página inicial", () => {});
  // último teste
  it("Ir para cadastrar usuário", () => {});
});
