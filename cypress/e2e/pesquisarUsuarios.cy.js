import { faker } from "@faker-js/faker";
import { PaginaPrincipal } from "../support/pages/paginaPrincipal";

describe("Listar usuários", () => {
  beforeEach(() => {
    cy.visit("/users");
    cy.intercept("GET", "/api/v1/search?value=*").as("getPesquisa");
  });

  let pgPrincipal = new PaginaPrincipal();
  let nomeUser;
  let emailUser;
  let idUser;

  it("A barra de pesquisa existe e funciona", function () {
    cy.get("input").should("exist");
    cy.get("input").should("be.enabled");
  });

  it("Pesquisar usuário pelo nome", () => {
    cy.cadastrarUsuário().then(function (resposta) {
      nomeUser = resposta.nome;
      emailUser = resposta.email;
      idUser = resposta.id;

      cy.get("input").type(nomeUser);
      // Não precisa do .then, pq eu não vou precisar dos valores da requisição de pesquisa
      cy.wait("@getPesquisa");
      cy.get("[id='userData']").should("have.length", 1);
      cy.contains("Nome:")
        .invoke("text")
        .should("be.equal", "Nome: " + nomeUser);
      cy.contains("E-mail:")
        .invoke("text")
        .then(function (email) {
          let emailCorreto = email
            .split("E-mail: ")
            .toString()
            .split("...")
            .toString()
            .split(",")[1];

          expect(emailUser.includes(emailCorreto)).to.equal(true);
        });

      cy.deletarUsuario(idUser);
    });
  });

  it("Pesquisar usuário pelo email", () => {
    cy.cadastrarUsuário().then(function (resposta) {
      nomeUser = resposta.nome;
      emailUser = resposta.email;
      idUser = resposta.id;

      cy.get("input").type(emailUser);
      cy.wait("@getPesquisa");
      cy.get("[id='userData']").should("have.length", 1);
      cy.contains("Nome:")
        .invoke("text")
        .should("be.equal", "Nome: " + nomeUser);
      cy.contains("E-mail:")
        .invoke("text")
        .then(function (email) {
          let emailCorreto = email

            .split("E-mail: ")
            .toString()
            .split("...")
            .toString()
            .split(",")[1];

          expect(emailUser.includes(emailCorreto)).to.equal(true);
        });

      cy.deletarUsuario(idUser);
    });
  });

  it("O botão de apagar e resetar o campo funciona corretamente", function () {
    pgPrincipal.digitarPesquisa();
    cy.get(pgPrincipal.buttonsPesquisar).eq(1).click();
    cy.get(pgPrincipal.inputDePesquisa).should("be.empty");
  });

  it("A requisição de pesquisa só acontece após escrever no campo", function () {
    cy.intercept("GET", "/api/v1/search?value=*").as("pesquisar");

    cy.get("@pesquisar").should("not.exist");
    pgPrincipal.digitarPesquisa();
    cy.wait("@pesquisar").should("exist");
  });

  describe("Listagem de usuário com erros", () => {
    it("Não deve ser encontrado um usuário através de seu ID", () => {
      cy.cadastrarUsuário().then((resposta) => {
        idUser = resposta.id;

        cy.get("input").type(idUser);
        cy.wait("@getPesquisa");
        cy.contains(
          "h3",
          "Ops! Não existe nenhum usuário para ser exibido."
        ).should("exist");

        cy.deletarUsuario(idUser);
      });
    });

    it("Não deverá pesquisar se não houver nada escrito na barra de pesquisa", function () {
      cy.get("@getPesquisa").should("not.exist");
    });

    it("Deve aparecer as informações corretas se não encontrar nenhum usuário na pesquisa", () => {
      cy.get("input").type("novo-Usuario-8728667");
      cy.wait("@getPesquisa");
      cy.contains(
        "h3",
        "Ops! Não existe nenhum usuário para ser exibido."
      ).should("exist");
    });
  });
});
