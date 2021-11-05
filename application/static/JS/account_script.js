/*  Os Scripts de Conta são responsáveis por controlar os processos
    de alteração, exclusão e apresentação dos dados dos usuários logados */

import { getUserValidatedData } from "./utilities_script.js";

getUserAccountData();
changeMyProfileForm();

// "Event Listeners" para chamar as funções necessárias
$("#confirm-button").click(checkModalPassword);

$("#alter-data").click(function () {
  changeModalStructure("update");
});
$("#del-data").click(function () {
  changeModalStructure("delete");
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
    success: function (response) {
      /*  Em algum caso raro de mesmo na sessão local
            o id não for encontrado, ele leva o usuário para
            a página home, além de impedir acesso de usuários
            anônimos a página do perfil */
      showUserAccountData(response["result"]);
    },
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
  for (let i = 0; i < inputs.length; i++) {
    let key = inputs.eq(i).attr("name");
    inputs[i].value = userData[key];

    // Devido a auto-formatação da data vindo do back-end, fora necessário
    // mudar o separador '-' por '.' no retorno de dado pelo back-end, então em js
    // precisa-se inverter para formar uma data aceita pelo campo do tipo 'date'
    if (key === "born") {
      inputs[i].value = userData["born"].replace(/[.]/gi, "-");
    }
  }

  // Apenas preenche o nome e idade do box
  $("#username").text(userData["name"]);
  $("#user-age").text(userAge.toString() + " Anos");
}

/* Altera o formulário de listagem dos dados para não aparecer o campo coren */
function changeMyProfileForm() {
  let corenField = $("input[name='coren']").parent();
  let cpfField = $("input[name='CPF']").parent();

  if (localStorage["userType"] === "NORMAL USER") {
    corenField.hide();
    cpfField.removeClass("col-md-6");
    cpfField.addClass("col-md-12");
  }
}

/*  Função para exclusão da conta dos usuários, ativada somente
    sob fornecimento e verificação da senha do usuário */
function deleteAccount() {
  // Obtém dados da sessão local
  let userId = localStorage["userId"];
  let userType = localStorage["userType"];

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
        // Alerta o usuário da exclusão e o redireciona
        alert("Sua conta foi deletada! Você será redirecionado...");
        window.location.href = "/";
        localStorage.clear();
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

  $.ajax({
    type: "PUT",
    url: "/my-profile",
    data: JSON.stringify(formattedUserData),
    dataType: "json",
    contentType: "application/json",
    success: function () {
      window.location.reload();
    },
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
  let modalType = $(".modal-dialog")[0].getAttribute("id");

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
        // Esconde o modal e mostra o botão para mandar os dados
        // atualizados para o servidor se o modal for do tipo update
        if (modalType === "modal-update") {
          $("#modal-account").modal("hide");
          $("#update-button").show();
          // Habilita a edição dos inputs bloqueados, com exceção do
          // coren e cpf
          $(".form-control").each(function (index, element) {
            if (
              $(element).prop("disabled") &&
              $(element).attr("name") !== "CPF" &&
              $(element).attr("name") !== "coren"
            ) {
              $(element).prop("disabled", false);
            }
          });
        } else {
          // se o modal for delete, chama a função deleteAccount()
          deleteAccount();
        }
        message.text("");
      } else {
        // se a senha não condizer avisa ao usuário
        message.text("Senha incorreta!");
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}
