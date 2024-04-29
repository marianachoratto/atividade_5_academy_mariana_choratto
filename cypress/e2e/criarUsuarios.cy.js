import { faker } from "@faker-js/faker";
import CadastrarUsuarios from "../support/pages/CadastrarUsuarios";
import { PaginaDetalhes } from "../support/pages/PaginaDetalhes";

describe("Teste de criar usuários", () => {
  let cadastrarUsuario = new CadastrarUsuarios();
  let paginaDetalhes = new PaginaDetalhes();
  let nome = generateUsernameWithoutNumbers(5);
  let email = faker.internet.email();
  let nomeUser;
  let userId;
  let emailUser;
  const apiUrl = "rarocrud-80bf38b38f1f.herokuapp.com/api/v1";

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

      // Apagar usuário
    });

    it("checando se o usuário foi criado no banco de dados", function () {
      cy.cadastrarUsuário().then(function (resposta) {
        cy.log(resposta);
        nomeUser = resposta.nome;
        userId = resposta.id;
        emailUser = resposta.email;

        cadastrarUsuario.typeNome(nomeUser);
        cadastrarUsuario.typeEmail(emailUser);
        cadastrarUsuario.clickcadastrar();
        cy.contains("Usuário salvo com sucesso!").should("be.visible");

        cy.visit(`/users/${userId}`);
        cy.get(paginaDetalhes.InputId).should("have.value", userId);
        cy.get(paginaDetalhes.InputName).should("have.value", nomeUser);
        cy.get(paginaDetalhes.InputEmail).should("have.value", emailUser);

        cy.deletarUsuario(userId);
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
    it("Não deve ser possível cadastrar usuário com e-mail já utilizado em outro cadastro", function () {
      cy.cadastrarUsuário().then(function (resposta) {
        cy.intercept("POST", "/api/v1/users").as("criarUsuario");
        nomeUser = resposta.nome;
        emailUser = resposta.email;
        userId = resposta.id;

        cy.log(userId, nomeUser);

        cadastrarUsuario.typeNome(nomeUser);
        cadastrarUsuario.typeEmail(emailUser);
        cadastrarUsuario.clickcadastrar();
        cy.wait("@criarUsuario");

        cy.contains("Este e-mail já é utilizado por outro usuário.");

        cy.deletarUsuario(userId);
      });
    });

    it("Não deve ser possível cadastrar usuário com e-mail já utilizado em outro cadastro", function () {
      cy.intercept(
        "POST",
        "rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users"
      ).as("criarUsuario");

      cy.cadastrarUsuário().then(function (resposta) {
        nomeUser = resposta.nome;
        emailUser = resposta.email;
        userId = resposta.id;

        cy.log(userId, nomeUser);
      }),
        cadastrarUsuario.typeNome(nomeUser);
      cadastrarUsuario.typeEmail(emailUser);
      cadastrarUsuario.clickcadastrar();
      cy.contains("Este e-mail já é utilizado por outro usuário.");

      deletarUsuario(userId);
    });

    it.only("Não deve ser possível cadastrar um nome com mais de 100 caracteres", () => {
      let nomeCriado = "";
      for (let i = 1; i <= 101; i++) {
        nomeCriado += "a";
      }

      cy.log(nomeCriado.length);
    });

    it("Não deve ser possível cadastrar um nome com menos de 4 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com mais de 60 caracteres", () => {});

    it("Não deve ser possível cadastrar um e-mail com menos de ? caracteres", () => {});
  });
});
