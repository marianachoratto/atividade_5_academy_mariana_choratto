export class PaginaPrincipal {
  buttonDelete = '[data-test="userDataDelete"]';
  anchorVerDetalhes = "#userDataDetalhe";
  inputDePesquisa = '[autocomplete="off"]';
  divListaDeUsuarios = "#listaUsuarios > #userData";
  divDadosUsuarios = "#userData";
  pNome = "#userDataName";
  buttonsPesquisar = ".sc-iGgWBj.cvYpuE";

  liTextoPaginas = "#paginacaoAtual";
  paginaAnterior = "#paginacaoVoltar";
  paginaProxima = "#paginacaoProximo";

  // ver se vai precisar nos testes
  anchorRaro = '[href="/"]';
  anchorVoltar = '[href="/users/novo"]';

  clickDelete() {
    cy.get(this.buttonDelete).first().click();
    cy.contains("button", "Confirmar").click();
  }

  clickPaginaDeDetalhes() {
    cy.get(this.anchorVerDetalhes).first().click();
  }

  digitarPesquisa() {
    cy.get(this.inputDePesquisa).type("oi");
  }
}
