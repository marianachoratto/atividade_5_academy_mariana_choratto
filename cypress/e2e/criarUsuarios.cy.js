import { faker } from "@faker-js/faker";
import CadastrarUsuarios from "../support/pages/CadastrarUsuarios";
import { PaginaDetalhes } from "../support/pages/PaginaDetalhes";

describe("Teste de criar usuários", () => {
  let cadastrarUsuario = new CadastrarUsuarios();
  let paginaDetalhes = new PaginaDetalhes();
  let nome = "faker" + faker.person.firstName();
  let email = faker.internet.email();
  let nomeUser;
  let userId;
  let emailUser;
  const apiUrl = "rarocrud-80bf38b38f1f.herokuapp.com/api/v1";

  beforeEach(() => {
    cy.visit("/users/novo");
  });

  describe("Deve criar usuários com sucesso", function () {
    it("Deve criar usuários com sucesso", () => {
      cy.intercept("POST", "/api/v1/users").as("criarUsuarioComSucesso");

      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.wait("@criarUsuarioComSucesso").then(function (resposta) {
        let usuarioId = resposta.response.body.id;
        cy.contains("Usuário salvo com sucesso!").should("be.visible");

        cy.deletarUsuario(usuarioId);
      });
    });

    it("checando se o usuário foi criado no banco de dados", function () {
      cy.intercept("POST", "/api/v1/users").as("criarUsuarioComSucesso");

      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.wait("@criarUsuarioComSucesso").then(function (resposta) {
        let usuarioId = resposta.response.body.id;
        let usuarioNome = resposta.response.body.name;
        let usuarioEmail = resposta.response.body.email;

        cy.contains("Usuário salvo com sucesso!").should("be.visible");

        cy.visit(`/users/${usuarioId}`);
        cy.get(paginaDetalhes.InputId).should("have.value", usuarioId);
        cy.get(paginaDetalhes.InputName).should("have.value", usuarioNome);
        cy.get(paginaDetalhes.InputEmail).should("have.value", usuarioEmail);

        cy.deletarUsuario(usuarioId);
      });
    });
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

    it("O email não deve ser criado sem o domínio @.co", () => {
      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail("marianagmail.com");
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Formato de e-mail inválido").should("be.visible");
    });

    it("Não deve ser cadastrado nome com números", () => {
      cadastrarUsuario.typeNome("mc12345");
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Formato do nome é inválido.").should("be.visible");
    });
  });

  describe("Testes com máximo e mínimo de caracteres", function () {
    it("Não deve ser possível cadastrar usuário com e-mail já utilizado em outro cadastro", function () {
      cy.cadastrarUsuário().then(function (resposta) {
        cy.intercept("POST", "/api/v1/users").as("criarUsuario");
        nomeUser = resposta.nome;
        emailUser = resposta.email;
        userId = resposta.id;

        cadastrarUsuario.typeNome(nomeUser);
        cadastrarUsuario.typeEmail(emailUser);
        cadastrarUsuario.clickcadastrar();
        cy.wait("@criarUsuario");

        cy.contains("Este e-mail já é utilizado por outro usuário.");

        cy.deletarUsuario(userId);
      });
    });

    it("Deve ser possível cadastrar usuário com nome de até 100 caracteres", function () {
      cy.intercept("POST", "/api/v1/users").as("criarUsuario");
      let nomeCriado = "";
      for (let i = 1; i <= 100; i++) {
        nomeCriado += "a";
      }

      cadastrarUsuario.typeNome(nomeCriado);
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.wait("@criarUsuario");
      cy.contains("Usuário salvo com sucesso!").should("exist");
    });

    it("Não deve ser possível cadastrar um nome com mais de 100 caracteres", () => {
      let nomeCriado = "";
      for (let i = 1; i <= 101; i++) {
        nomeCriado += "a";
      }
      cadastrarUsuario.typeNome(nomeCriado);
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("Informe no máximo 100 caracteres para o nome").should(
        "exist"
      );
    });

    it("Não deve ser possível cadastrar um nome com menos de 4 caracteres", () => {
      cadastrarUsuario.typeNome("Ana");
      cadastrarUsuario.typeEmail(email);
      cadastrarUsuario.clickcadastrar();
      cy.contains("span", "Informe pelo menos 4 letras para o nome.").should(
        "be.exist"
      );
    });

    it("Não deve ser possível cadastrar um e-mail com mais de 60 caracteres", () => {
      let emailCriado = "email@.com";
      for (let i = 1; i <= 51; i++) {
        emailCriado += "m";
      }

      cadastrarUsuario.typeNome(nome);
      cadastrarUsuario.typeEmail(emailCriado);
      cadastrarUsuario.clickcadastrar();
      cy.contains("Informe no máximo 60 caracteres para o e-mail").should(
        "exist"
      );
    });
  });
});
