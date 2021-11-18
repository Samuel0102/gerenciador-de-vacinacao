/*  Os Scripts de Conta são responsáveis por controlar os processos
    de alteração, exclusão e apresentação dos dados dos usuários logados */

import { getUserValidatedData, showResult } from "./utilities_script.js";

// "Event Listeners" para chamar as funções necessárias
$(document).ready(getUserAccountData);

$("#confirm-button").click(checkModalPassword);

$("#alter-data").click(function () {
  changeModalStructure("update", "Confirmação de Atualização");
});
$("#del-data").click(function () {
  let message =
    "*Seus dados de vacinação serão enviados por email, após exclusão!";
  changeModalStructure("delete", "Confirmação de Exclusão", message);
});

$("#update-button").click(updateAccountData);

/*  Função para obter dados a respeito do usuário logado
    a partir de conexão com back-end */
function getUserAccountData() {
  // Obtém dados do usuário logado atual, através da sessão local
  let userType = localStorage.getItem("userType");
  let userIdentifier = localStorage.getItem("userCpf");

  // Constrói URL como especificado na route
  let url = "/user-data/" + userType + "/" + userIdentifier;

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    contentType: "application/json",
    success: (response) => showUserAccountData(response["result"]),
    error: function () {
      window.location.href = "/";
    },
  });
}

/*  Obtendo como parâmetro os dados obtidos da função de busca de usuário
    esta função é responsável por preencher os formulários, além do box com
    nome e idade do usuário logado */
function showUserAccountData(userData) {
  let inputs = $(".form-control");
  // Retorna a idade do usuário, com base em ano dado no cadastro
  let userAge =
    new Date().getFullYear() - parseInt(userData["born"].slice(0, 5));

  // Laço que percorre todos os campos do formulário, preenchendo-os
  // com os dados obtidos na função de busca
  inputs.each((index) => {
    let key = inputs.eq(index).attr("name");
    inputs.eq(index).val(userData[key]);

    // mudança no formato de data do backend, a fim de conseguir
    // preencher o input do tipo date
    if (key === "born") {
      inputs.eq(index).val(userData["born"].replace(/[.]/gi, "-"));
    }
  });

  // Apenas preenche o nome e idade do box
  $("#username").text(userData["name"]);
  $("#user-age").text(userAge.toString() + " Anos");
}

/*  Função para exclusão da conta dos usuários, ativada somente
    sob fornecimento e verificação da senha do usuário */
function deleteAccount() {
  // Obtém dados da sessão local
  let userId = localStorage["userId"];
  let userType = localStorage["userType"];

  // confirmação de que o processo é de exclusão
  if (
    $(".modal-dialog").attr("id") === "modal-update" ||
    $(".modal-dialog").attr("id") === "modal-delete"
  ) {
    return;
  }

  let userData = {
    type: userType,
    id: userId,
  };

  /*  Fora utilizada passagem de dados ao invés de especificar na rota
      visando praticidade e legibilidade, visto que a rota precisaria 
      especificar o tipo do usuário além do processo "delete" */
  $.ajax({
    type: "DELETE",
    url: "/my-profile",
    data: JSON.stringify(userData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response["result"] === "USER DELETED") {
        localStorage.clear();
        changeModalStructure("success-delete", "Exclusão Realizada");
        $("#confirm-button").click(() => location.href = "/");
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}

/*  Função para atualizar os dados anteriormente cadastrados. Funciona somente
    sob fornecimento e verificação da senha do usuário */
function updateAccountData() {
  // Obtém os dados preenchidos nos formulários pela função
  // showUserAccountData()
  let formattedUserData = getUserValidatedData();

  // Verifica a integridade dos dados, isto é, se passaram corretamente
  // pelos validadores de formulários
  if (formattedUserData === undefined) {
    return;
  }

  formattedUserData.id = parseInt(localStorage["userId"]);
  formattedUserData.type = localStorage["userType"];

  $.ajax({
    type: "PUT",
    url: "/my-profile",
    data: JSON.stringify(formattedUserData),
    dataType: "json",
    contentType: "application/json",
    success: () => location.reload(),
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}

/*  Função para verificar se a senha fornecida no modal de Alteração/Exclusão
    condiz com a senha fornecida no cadastro e salva no servidor */
function checkModalPassword() {
  // Obtem a senha do Modal, a mensagem para indicar a corretude da senha
  // e o tipo de Modal
  let modalPassword = $("#modal-confirmp").val();
  let message = $("#message");
  let modalType = $(".modal-dialog").attr("id");

  let userData = {
    type: localStorage["userType"],
    id: localStorage["userId"],
    password: modalPassword,
  };

  // Envia para a rota de verificação, que retorna um Boolean
  $.ajax({
    type: "POST",
    url: "/check-password",
    data: JSON.stringify(userData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response["result"]) {
        switch (modalType) {
          case "modal-update":
            unlockInputs();
            break;
          case "modal-delete":
            let message = `*Se o e-mail não for encontrado, seu PDF será <span class='text-danger'>PERDIDO!</span>`;

            if (localStorage["userType"] === "NORMAL USER") {
              changeModalStructure(
                "normal-user-alert",
                "Aviso de Exclusão",
                message
              );
            } else {
              changeModalStructure(
                "super-user-alert",
                "Aviso de Desativação",
                ""
              );
            }
            $("#confirm-button").click(deleteAccount);
            break;
        }
      } else {
        // se a senha não condizer avisa ao usuário
        showResult("notification", false, message, "Senha incorreta!");
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}

/*  Função para liberar a edição dos inputs */
function unlockInputs() {
  $("#modal-account").modal("hide");
  $("#update-button").show();

  // Habilita a edição dos inputs bloqueados, com exceção do
  // coren e cpf
  $(".enable-input").each(function (index, element) {
    if ($(element).prop("disabled")) {
      $(element).prop("disabled", false);
    }
  });
}
