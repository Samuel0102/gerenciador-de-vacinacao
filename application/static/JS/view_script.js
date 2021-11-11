// Os Scripts de VIEW são responsáveis pelo dinanismo do front-end,
// relacionados a exibição ou não de elementos

$(document).ready(() => {
  changeHeaderNav();
  changeMyProfileForm();
});

$(".register-icon").click((ev) => changeRegisterForm(ev.target));
$(".login-icon").click((ev) => changeLoginForm(ev.target));

$("#header-user-icon").click(showUserDropdown);
$(".logout-option").click(logoutUser);

$("#dose").change(disableNextDoseDate);

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

/*  Modifica o formulário da página do perfil, mostrando
    ou não o campo COREN */
function changeMyProfileForm() {
  let corenField = $("#coren").parent();

  if (localStorage["userType"] === "NORMAL USER") corenField.hide();
}

/*  Função executada em todas as páginas, é responsável
    por controlar a exibição dos itens do menu do cabeçalho, 
    impedindo que usuários do tipo comum(pacientes) consigam
    ver links de acesso restrito a super usuários(enfermeiros) */
function changeHeaderNav() {
  // Obtém a sessão local que armazena o tipo de usuário da sessãoa atual
  let isNurse = localStorage["userType"] === "SUPER USER";

  $(".only-super-user").each((index, element) => {
    if (!isNurse) $(element).hide();
  });

  $(".only-normal-user").each((index, element) => {
    if (isNurse) $(element).hide();
  });

  changeUserArea();
}

/*  Função executada em todas as páginas, responsável por
    fornecer ou opções para usuários logados ou opção de 
    cadastrar e logar para usuários anônimos */
function changeUserArea() {
  let loggedUserIcon = $("#header-user-icon");
  let hasLoggedUser = localStorage.length > 0;
  let loggedUserOption = $("#logged-user-option");
  let guestUserOptions = $("#guest-user-options");

  // Verifica se há valores numa sessão local, isto é
  // se há algum usuário logado
  if (hasLoggedUser) {
    loggedUserIcon.attr(
      "class",
      "fas fa-user-circle display-4 d-none d-sm-block"
    );
    loggedUserOption.show();
    guestUserOptions.hide();
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
}

/*  Função para modificar a estrutura do Modal de alteração,
    exclusão da conta ou confirmação de exclusão  */
function changeModalStructure(action, title, message = "") {
  let modalTitle = $("#modal-title");
  let modalMessage = $("#message");
  let modal = $(".modal-dialog");

  let modalTextDefault = `Este é um procedimento de alto risco e necessita da confirmação da
    sua senha. Digite-a e após clicar em "Confirmar & Continuar" a
    ação de Exclusão/Alteração será
    <strong class="text-danger"> PERMANENTE</strong> e
    <strong class="text-danger"> IRREVERSÍVEL</strong>, faça por sua
    conta e risco!*`;

  // define os conteúdos do modal
  $("#modal-input").show();
  modalTitle.text(title);
  modalMessage.html(message);
  modal.attr("id", `modal-${action}`);

  if (action === "delete-confirm") {
    modalTextDefault = `Verifique se o email ${$("#user-email").val()} é
      válido. Se SIM, clique em Confirmar & Continuar*`;
    $("#modal-input").hide();

  } else if (action === "super-user-alert") {
    modalTextDefault = `Sua conta como enfermeiro não será deletado do nosso sistema. No entanto
    ela será desativada e, portanto, você não poderá mais logar, cadastrar vacina, cadastrar
    vacinação ou visualizar seu perfil. Além disso não poderá se cadastrar novamente com o seu coren.
    Observando esses pontos,se deseja continuar, clique em Confirmar & Continuar`;
    $("#modal-input").hide();
  }

  $("#modal-body-text").html(modalTextDefault);
}

/*  Função para desabilitar input de nova dose, se o cadastro for de
    dose única  */
function disableNextDoseDate() {
  let nextDoseInput = $("#next-date");

  if ($("#dose").val() === "dose-unica") {
    nextDoseInput.prop("disabled", true);
    nextDoseInput.parent().hide();
    nextDoseInput.removeClass("enable-input");
  } else {
    nextDoseInput.prop("disabled", false);
    nextDoseInput.parent().show();
    nextDoseInput.addClass("enable-input");
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
