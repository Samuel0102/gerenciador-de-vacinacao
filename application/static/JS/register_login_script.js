// Os scripts de Registro e Login são relacionados aos processos de login
// e registro no sistema, bem como invocação de validação de dados

// Chamada dos métodos validadores
import {
  getUserValidatedData,
  getLoginData
} from "./utilities_script.js";

$("#register-button").click(function () {
  registerNewUser();
});

/*  Função para realizar a conexão e envio dos dados do novo usuário ao servidor */
function registerNewUser() {
  let formattedUserData = getUserValidatedData();

  // Verifica se os dados estão certos e passaram na validação
  if(formattedUserData.length === 1){
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
          userNotification.text("CPF/Coren já cadastrado!");
          userNotification.addClass("text-danger");
          break;
        case "USER REGISTERED":
          userNotification.text("Cadastro feito com sucesso!");
          userNotification.addClass("text-success");
          userNotification.removeClass("text-danger");
          break;
      }
    },
    error: function () {
      alert("Houve uma falha no sistema, por favor recarregue a página!");
    },
  });
}

$("#login-button").click(function () {
  loggeUser();
});

/*  Função para realizar login por meio de conexão com back-end 
    envia o pequeno objeto json contendo dados do login e qual 
    o tipo de usuário, a fim de facilitar busca no banco */
function loggeUser() {
  let loginData = getLoginData();

  if(loginData === undefined){
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
          localStorage.setItem("user-coren", response["user-coren"])


          userNotification.text(
            "Login realizado com sucesso, redirecionando..."
          );
          userNotification.addClass("text-success");
          userNotification.removeClass("text-danger");

          setTimeout(function () {
            window.location.href = "/";
          }, 4000);
          break;

        case "INCORRECT LOGIN":
          userNotification.text("CPF/COREN ou senha incorretos!");
          userNotification.addClass("text-danger");
          userNotification.removeClass("text-success");
          break;
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}
