// Os scripts de Registro e Login são relacionados aos processos de login
// e registro no sistema, bem como invocação de validação de dados

// Chamada dos métodos validadores
import {
  getUserValidatedData,
  getLoginData,
  showResult,
} from "./utilities_script.js";

$("#register-button").click(registerNewUser);

/*  Função para realizar a conexão e envio dos dados do novo usuário ao servidor */
function registerNewUser() {
  let formattedUserData = getUserValidatedData();

  // Verifica se os dados estão certos e passaram na validação
  if (formattedUserData === undefined) {
    return;
  }

  const userNotification = $("#user-notification");
  $.ajax({
    type: "POST",
    url: "/user-register",
    data: JSON.stringify(formattedUserData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      userNotification.empty();
      switch (response["result"]) {
        /*  Verifica a resposta do servidor e notifica ao usuário
            se houve sucesso no cadastro, ou se aquele CPF/COREN 
            já estava registrado no banco */
        case "CPF/COREN IN USE":
          showResult(
            "notification",
            false,
            userNotification,
            "CPF/COREN Já Cadastrado!"
          );
          break;
        case "USER REGISTERED":
          showResult(
            "notification",
            true,
            userNotification,
            "Cadastro feito com Sucesso!"
          );

          setTimeout(function () {
            location.href = "/login";
          }, 4000);
          break;
      }
    },
    error: function () {
      alert("Houve uma falha no sistema, por favor recarregue a página!");
    },
  });
}

$("#login-button").click(loggeUser);

/*  Função para realizar login por meio de conexão com back-end 
    envia o pequeno objeto json contendo dados do login e qual 
    o tipo de usuário, a fim de facilitar busca no banco */
function loggeUser() {
  let loginData = getLoginData();

  if (loginData === undefined) {
    return;
  }

  const userNotification = $("#user-notification");
  $.ajax({
    type: "POST",
    url: "/login",
    data: JSON.stringify(loginData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      switch (response["result"]) {
        /* Verifica se as informaçóes condizem com registro do banco,
            se sim cria uma sessão local, guardando o tipo de usuário e
            seu identificador na base de dados, além de notificar o usuário */
        case "SUCCESS LOGIN":
          localStorage.setItem("userType", loginData["type"]);
          localStorage.setItem("userId", response["user-id"]);
          localStorage.setItem("userCpf", response["user-cpf"]);
          if (localStorage["userType"] === "SUPER USER") {
            localStorage.setItem("userCoren", response["user-coren"]);
          }

          showResult(
            "notification",
            true,
            userNotification,
            "Login realizado com sucesso, redirecionando..."
          );

          setTimeout(function () {
            location.href = "/";
          }, 4000);
          break;

        case "USER NOT REGISTERED":
          showResult(
            "notification",
            false,
            userNotification,
            "CPF/COREN não cadastrado no sistema!"
          );
          break;
        case "INCORRECT LOGIN":
          showResult(
            "notification",
            false,
            userNotification,
            "CPF/COREN ou senha incorretos!"
          );
          break;
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}
