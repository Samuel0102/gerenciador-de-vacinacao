// Os Scripts de VIEW são responsáveis pelo dinanismo do front-end,
// relacionados a exibição ou não de elementos

$(document).ready(changeHeaderNav, changeMyProfileForm);

$(".register-icon").click((ev) => changeRegisterForm(ev.target));
$(".login-icon").click((ev) => changeLoginForm(ev.target));

$("#header-user-icon").click(showUserDropdown);
$(".logout-option").click(logoutUser);

/*  Função para modificar o formulário de registro,
    se o usuário escolher cadastro como paciente,
    o campo coren será desabilitado */
function changeRegisterForm(type) {
  let corenArea = $("#user-coren");
  let corenInput = $("input[name='coren']");

  // Bloco switch pra controlar a visualização do campo coren
  switch (type.getAttribute("id")) {
    case "icon-pacient":
      corenArea.hide();
      corenInput.prop("disabled", true);
      corenInput.removeClass("enable-input");
      break;
    default:
      corenArea.show();
      corenInput.prop("disabled", false);
      corenInput.addClass("enable-input");
      break;
  }
}

/*  Função para modificar o formulário de login
    alterando o label e o valor do placeholder */
function changeLoginForm(type) {
  let identifierLabel = $(".form-label").eq(0);
  let identifierInput = $(".form-control").eq(0);

  // Bloco switch para manipular elemento label e atributo placeholder
  switch (type.getAttribute("id")) {
    case "icon-pacient":
      identifierLabel.text("CPF");
      identifierInput.attr("name", "CPF");
      identifierInput.attr("placeholder", "XXX.XXX.XXX-XX");
      break;
    default:
      identifierLabel.text("COREN");
      identifierInput.attr("name", "coren");
      identifierInput.attr("placeholder", "coren-UF xxx-categoria");
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

  if (
    userDropdown.css("display") === "none" &&
    $("#header-user-icon").attr("class") != ""
  ) {
    userDropdown.show("slow");
  } else {
    userDropdown.hide("slow");
  }

  if (localStorage["userType"] === "SUPER USER") {
    $(".only-normal-user").each((index, element) => $(element).hide());
  }
}

/*  Função para modificar a estrutura do Modal de ou alteração
    ou exclusão da conta */
function changeModalStructure(action, title, message = "") {
  let modalTitle = $("#modal-title");
  let modalMessage = $("#message");
  let modal = $(".modal-dialog");

  const modalTextDefault = `Este é um procedimento de alto risco e necessita da confirmação da
    sua senha. Digite-a e após clicar em "Confirmar & Continuar" a
    ação de Exclusão/Alteração será
    <strong class="text-danger"> PERMANENTE</strong> e
    <strong class="text-danger"> IRREVERSÍVEL</strong>, faça por sua
    conta e risco!*`;

  modalTitle.text(title);
  modalMessage.text(message);
  $("#modal-body-text").html(modalTextDefault);
  $("#modal-input").show();

  switch (action) {
    case "delete-confirm":
      const modalTextAlert = `Verifique se o email ${$(
        "input[name='email']"
      ).val()} é válido e clique em 'Confirmar & Continuar'*`;
      $("#modal-body-text").text(modalTextAlert);
      $("#modal-input").hide();
      break;
    default:
      modal.attr("id", `modal-${action}`);
      break;
  }
}

function changeMyProfileForm() {
  let corenField = $("input[name='coren']").parent();
  let cpfField = $("input[name='CPF']").parent();

  if (localStorage["userType"] === "NORMAL USER") {
    corenField.hide();
    cpfField.removeClass("col-md-6");
    cpfField.addClass("col-md-12");
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
