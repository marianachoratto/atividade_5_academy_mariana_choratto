import { faker } from "@faker-js/faker";
import CadastrarUsuarios from "../support/pages/CadastrarUsuarios";

describe("Teste de criar usuários", () => {
  let cadastrarUsuario = new CadastrarUsuarios();
  let baseUrl = "https://rarocrud-frontend-88984f6e4454.herokuapp.com";
  let nome = generateUsernameWithoutNumbers(5);
  let email = faker.internet.email();

  function generateUsernameWithoutNumbers() {
    // Gerando um nome de usuário com base em nomes reais
    let username = faker.internet.userName();

    // Removendo números do nome de usuário
    username = username.replace(/[0-9_]/g, "");

    return username;
  }

  beforeEach(() => {
    cy.visit("/users/novo");
  });

  describe("Deve criar usuários com sucesso", function () {
    it("Deve criar usuários com sucesso", () => {
      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("Usuário salvo com sucesso!").should("be.visible");

      // como deletar esse indivíduo?
    });

    it("checando se o usuário foi criado no banco de dados", function () {});

    // apagar usuário
  });

  describe("Testes de erro", function () {
    it("Não deve criar usuário sem nome", () => {
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "O campo nome é obrigatório.").should("be.visible");
    });

    it("Não deve criar usuário sem email", () => {
      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "O campo e-mail é obrigatório.").should("be.visible");
    });

    it("Não deve criar usuário sem nome e email", () => {
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "O campo nome é obrigatório.").should("be.visible");
      cy.contains("span", "O campo e-mail é obrigatório.").should("be.visible");
    });

    it("O email não deve ser criado sem @.co", () => {
      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail("marianagmail.com");
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Formato de e-mail inválido").should("be.visible");
    });

    it("o nome deve ter pelo menos 4 letras", () => {
      cadastrarUsuario.typeNome("Ana");
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Informe pelo menos 4 letras para o nome.").should(
        "be.visible"
      );
    });

    it("Não deve ser cadastrado nome com números", () => {
      cadastrarUsuario.typeNome("mc12345");
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Formato do nome é inválido.").should("be.visible");
    });
  });

  describe("Testes com máximo e mínimo de caracteres", function () {
    it("Não deve ser possível cadastrar usuário com e-mail já utilizado em outro cadastro", () => {});

    it("Não deve ser possível cadastrar um nome com mais de 100 caracteres", () => {});

    it("Não deve ser possível cadastrar um nome com menos de 4 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com mais de 60 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com menos de ? caracteres", () => {});
  });
});
