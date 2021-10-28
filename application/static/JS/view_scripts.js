// Os Scripts de VIEW são responsáveis pelo dinanismo do front-end,
// relacionados a exibição ou não de elementos

/*  Função para modificar o formulário de registro,
    se o usuário escolher cadastro como paciente,
    o campo coren será desabilitado */
function changeRegisterForm(type) {
  let corenArea = $("#user-coren");
  let cpfArea = $("#user-cpf");
  let corenInput = $("input[name='coren']");

  // Bloco switch pra controlar a visualização do campo coren
  switch (type) {
    case "pacient":
      corenArea.hide();
      cpfArea.removeClass("col-md-5");
      cpfArea.addClass("col-md-11");
      corenInput.prop("disabled", true);
      corenInput.val("");
      break;
    case "nurse":
      corenArea.show();
      cpfArea.removeClass("col-md-11");
      cpfArea.addClass("col-md-5");
      corenInput.prop("disabled", false);
      break;
  }
}

/*  Função para modificar o formulário de login
    alterando o label e o valor do placeholder */
function changeLoginForm(type) {
  let identifierLabel = $(".form-label")[0];
  let identifierInput = $(".form-control")[0];

  // Bloco switch para manipular elemento label e atributo placeholder
  switch (type) {
    case "pacient":
      identifierLabel.innerText = "CPF";
      identifierInput.setAttribute("name", "CPF");
      identifierInput.setAttribute("placeholder", "XXX.XXX.XXX-XX");
      break;
    case "nurse":
      identifierLabel.innerText = "COREN";
      identifierInput.setAttribute("name", "coren");
      identifierInput.setAttribute("placeholder", "coren-UF xxx-categoria");
      break;
  }
}

/*  Função executada em todas as páginas, é responsável
    por controlar a exibição dos itens do menu do cabeçalho, 
    impedindo que usuários do tipo comum(pacientes) consigam
    ver links de acesso restrito a super usuários(enfermeiros) */
function changeHeaderNav() {
  // Obtém a sessão local que armazena o tipo de usuário da sessãoa atual
  let userType = localStorage.getItem("userType");

  // Bloco switch controlando a visibilidade dos links
  switch (userType) {
    case "SUPER USER":
      $("#vaccination-item").show();
      $("#vaccine-item").show();
      break;
    default:
      $("#vaccination-item").hide();
      $("#vaccine-item").hide();
      break;
  }

  changeUserArea();
}

/*  Função executada em todas as páginas, responsável por
    fornecer ou opções para usuários logados ou opção de 
    cadastrar e logar para usuários anônimos */
function changeUserArea() {
  let userIcon = $("#header-user-icon");
  let userOptions = $("#user-options");
  let registerLoginButtons = $("#register-login-buttons");

  // Verifica se há valores numa sessão local, isto é
  // se há algum usuário logado
  if (localStorage.length > 0) {
    userIcon.attr("class", "fas fa-user-circle display-4 d-none d-sm-block");
    userOptions.show();
    registerLoginButtons.hide();
  } else {
    userIcon.attr("class", "");
    userOptions.hide();
    registerLoginButtons.show();
  }
}

/*  Função para controlar visibilidade do sub-menu
    do ícone de usuários logados, permitindo o acesso
    a página do perfil e das vacinações, além da opção 
    de deslogar */
function showUserDropdown() {
  let userDropdown = $("#dropdown-user");

  if (userDropdown.css("display") === "none") {
    userDropdown.show("slow");
  } else {
    userDropdown.hide("slow");
  }
}

/*  Função para modificar a estrutura do Modal de ou alteração
    ou exclusão da conta */
function changeModalStructure(action) {
  let modalTitle = $("#modal-title");
  let message = $("#message");
  let modal = $(".modal-dialog")[0];

  switch (action) {
    case "delete":
      modalTitle.text("Confirmação de Exclusão de Conta");
      message.text(
        "OBS - Após o processo de exclusão, seus dados de vacinação serão enviados por email"
      );
      modal.setAttribute("id","modal-delete");
      break;
    case "update":
      modalTitle.text("Confirmação de Alteração de Conta");
      message.text("");
      modal.setAttribute("id","modal-update");
      break;
  }

}

/*  Função para deslogar usuários logados
    apenas limpando a sessão local e após redirecionando */
function logoutUser() {
  localStorage.clear();

  setTimeout(function () {
    window.location.href = "/";
  }, 5000);
}
