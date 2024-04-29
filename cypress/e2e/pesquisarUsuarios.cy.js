import { faker } from "@faker-js/faker";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("Deve ser encontrado um usuário através de seu ID", () => {});

  it("Pesquisar usuário pelo nome", () => {});

  it("Pesquisar usuário pelo email", () => {});

  describe("Listagem de usuário com erros", () => {
    it("Não deverá pesquisar se não houver nada escrito na barra de pesquisa", function () {});
    it("Deve receber 404 com id inexistente", () => {});

    it("Deve receber 500 se...?", () => {});
  });
});
