// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { faker } from "@faker-js/faker";

const apiUrl = "rarocrud-80bf38b38f1f.herokuapp.com/api/v1";

Cypress.Commands.add("cadastrarUsuário", () => {
  let name = "faker " + faker.person.firstName();
  let email = faker.internet.email().toLowerCase();
  let nomeUser;
  let userId;
  let emailUser;

  return cy
    .request({
      method: "POST",
      url: apiUrl + "/users",
      body: {
        name: name,
        email: email,
      },
    })
    .then((resposta) => {
      userId = resposta.body.id;
      nomeUser = resposta.body.name;
      emailUser = resposta.body.email;

      return {
        id: userId,
        nome: nomeUser,
        email: emailUser,
      };
    });
});

Cypress.Commands.add("deletarUsuario", (id) => {
  return cy.request({
    method: "DELETE",
    url: apiUrl + `/users/${id}`,
  });
});
