import { faker } from "@faker-js/faker";

describe("Teste de criar usuários", () => {
  beforeEach(() => {
    cy.visit("/novo");
  });

  it("Deve criar usuários com sucesso", () => {});

  it("Não deve criar usuário sem nome", () => {});

  it("Não deve criar usuário sem email", () => {});

  it("Não deve criar usuário sem nome e email", () => {});

  describe("Testes de bad requests", () => {
    it("O email não deve ser criado sem @", () => {});

    it("Não deve ser possível cadastrar usuário com e-mail já utilizado em outro cadastro", () => {});

    it("Não deve ser possível cadastrar um nome com mais de 100 caracteres", () => {});

    it("Não deve ser possível cadastrar um nome com menos de 4 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com mais de 60 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com menos de ? caracteres", () => {});
  });
});
