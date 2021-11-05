/*  Os Scripts Utilitários são os que definem funções úteis para
    outros módulos JS */

/* Função responsável por validar o CPF fornecido */
function validateCPF() {
  let userCPF = $("input[name='CPF']");
  // Regex para verificar o formato do dado passado, se corresponde
  // ao exigido no placeholder
  const base = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/i;
  const errorMSG = userCPF.next();

  let formatTest = new RegExp(base).test(userCPF.val());

  // Verifica se atende o formato exigido
  if (formatTest) {
    userCPF = userCPF.val().replace(/[^0-9]/gi, "");

    // Função Wrapper para validar os dois dígitos
    // conforme fórmula básica de validação de CPF
    let validateDigits = function () {
      let counter = 11;
      let resultFirstDigit = 0;
      let resultSecondDigit = 0;

      for (let i = 0; i < 9; i++) {
        counter--;
        resultFirstDigit += parseInt(userCPF[i]) * counter;
      }

      counter = 12;

      for (let i = 0; i < 10; i++) {
        counter--;
        resultSecondDigit += parseInt(userCPF[i]) * counter;
      }

      resultFirstDigit = (resultFirstDigit * 10) % 11;
      resultSecondDigit = (resultSecondDigit * 10) % 11;

      if (resultFirstDigit === 10) {
        resultFirstDigit = 0;
      }

      if (resultSecondDigit === 10) {
        resultSecondDigit = 0;
      }

      // Retorna se os digitos são válidos
      if (
        resultFirstDigit.toString() === userCPF.slice(-2, -1) &&
        resultSecondDigit.toString() === userCPF.slice(-1)
      ) {
        return true;
      }

      return false;
    };

    // Verifica se o CPF não consiste de 11 números iguais
    // e se os dígitos são validos, caso sim retorna True
    if (validateDigits() && userCPF.split(userCPF[0]).length !== 12) {
      $("input[name='CPF']").removeClass("border-danger");
      $("input[name='CPF']").addClass("border-success");
      errorMSG.text("");
      return true;
    }
  }

  // Notifica ao usuário caso o formato esteja errado ou há problema
  // nos dígitos
  $("input[name='CPF']").addClass("border-danger");
  errorMSG.text("CPF Inválido, siga o formato xxx.xxx.xxx-xx");
  return false;
}

/* Validação da senha, com base apenas na exigência de tamanho */
function validatePassword() {
  let userPassword = $("#password");
  let passwordConfirm = $("#confirmp");
  let errorMSGPass = userPassword.next();
  let errorMSGConfirm = passwordConfirm.next();

  let userPasswordLength = "";

  try {
    userPasswordLength = userPassword.val().length;
  } catch {
    return true;
  }

  // Verifica se a senha tem pelo menos 12 caracteres
  if (userPasswordLength >= 12) {
    userPassword.removeClass("border-danger");
    userPassword.addClass("border-success");
    errorMSGPass.text("");
  } else {
    userPassword.addClass("border-danger");
    errorMSGPass.text("Pelo menos 12 caracteres de senha!");
  }

  if (userPassword.val() === passwordConfirm.val()) {
    passwordConfirm.removeClass("border-danger");
    passwordConfirm.addClass("border-success");
    errorMSGConfirm.text("");
  } else {
    passwordConfirm.addClass("border-danger");
    errorMSGConfirm.text("As senhas não são iguais!");
  }

  if (errorMSGConfirm.text() === "" && errorMSGPass.text() === "") {
    return true;
  }

  return false;
}

/*  Faz validação do formato do COREN, não de sua existência */
function validateCoren() {
  let userCoren = $("input[name='coren']");

  // Regex para validar o formato do COREN
  const base = /^coren-[a-z]{2}\s[0-9]{3}-(enf$|te$|obst$|par$)/i;
  const errorMSG = userCoren.next();

  let formatTest = new RegExp(base).test(userCoren.val());

  if (userCoren.prop("disabled")) {
    return true;
  }

  const brasilStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  // Verificação se o formato corresponde ao exigido
  if (formatTest) {
    // Verifica se o UF é válido e existe
    if (
      brasilStates.indexOf(userCoren.val().slice(6, 8).toUpperCase()) !== -1
    ) {
      userCoren.removeClass("border-danger");
      userCoren.addClass("border-success");
      errorMSG.text("");
      return true;
    } else {
      userCoren.addClass("border-danger");
      errorMSG.text("UF não encontrado!");
      return false;
    }
  }

  userCoren.addClass("border-danger");
  errorMSG.text("COREN Inválido, siga o formato coren-uf xxx-categoria");
  return false;
}

/* Validação do formato do telefone passado */
function validateTel() {
  let userTel = $("input[name='tel']");
  // Regex para validar formato
  const base = /([0-9][0-9])9+([0-9]{4})-([0-9]{4})/i;
  const errorMSG = userTel.next();

  let formatTest = new RegExp(base).test(userTel.val().replace(" ", ""));

  // Apenas verifica se o valor passado foi validado pelo Regex
  if (formatTest) {
    userTel.removeClass("border-danger");
    userTel.addClass("border-success");
    errorMSG.text("");
    return true;
  }

  userTel.addClass("border-danger");
  errorMSG.text("Formato de telefone inválido, siga o formato ddd 9xxxx-xxxx");
  return false;
}

function checkPacientCpf() {
  $("#pacient-name").text("---");
  $("#pacient-age").text("---");

  if (validateCPF()) {
    let url = "/user-data/NORMAL USER/" + $("#CPF").val();

    $.get(url, function (response) {
      let test = response["result"] === "USER NOT FOUND";
      if (test) {
        $("#CPF").next().text("Paciente não existe!");
        $("#CPF").addClass("border-danger");
      } else {
        let pacientAge =
          new Date().getFullYear() -
          parseInt(response["result"]["born"].slice(0, 5));
        $("#pacient-name").text(response["result"]["name"]);
        $("#pacient-age").text(pacientAge + " Anos");
      }
    });
  }
}

function checkVaccine() {
  $("#vaccine-name").next().text("");

  if ($("#vaccine-name").val() === "") {
    $("#vaccine-name").next().text("Vacina não existe!");
    $("#vaccine-name").addClass("border-danger");
    return;
  }

  let url = "/check-vaccine/" + $("#vaccine-name").val().toUpperCase();
  $.get(url, function (response) {
    let test = response["result"] !== "VACCINE NOT FOUND";
    if (test) {
      $("#vaccine-name").addClass("border-success");
      $("#vaccine-name").removeClass("border-danger");
    } else {
      $("#vaccine-name").next().text("Vacina não existe!");
      $("#vaccine-name").addClass("border-danger");
    }
  });

}

/*  Função para validar dados relativos a usuários passados em inputs */
function getUserValidatedData() {
  // Obtém todos os inputs, com base na classe .form-control do bootstrap,
  // Define o Objeto dos dados e um contador para validação
  let inputData = $(".enable-input");
  let userData = {};
  let isAllFill = verifyFormFields();

  if (isAllFill) {
    // Laço percorre todos os inputs
    inputData.each(function (index, element) {
      userData[$(element).attr("name")] = $(element).val().toUpperCase();
    });
  }

  // Verifica se o usuário a cadastrar/alterar é do tipo Normal ou Super
  if (
    userData.coren === undefined
  ) {
    userData.type = "NORMAL USER";
  } else {
    userData.type = "SUPER USER";
  }

  let dataTest = [
    validateCoren(),
    validateCPF(),
    validatePassword(),
    validateTel(),
  ];

  // Com base no contador de inputs preenchidos e na validação de cpf, coren
  // e password retorna o objeto para as funções que chamarem esta função
  if (dataTest.every((teste) => teste)) {
    return userData;
  }
}

/*  Função para verificar corretude do CPF/COREN
    do formulário de LOGIN, gerando um pequeno objeto js
    que é interpretado pelo back-end */
function getLoginData() {
  let identifierInput = $("#user-identifier");
  let passwordInput = $("#user-password").val();
  let userType = "SUPER USER";
  let testIdentifier = validateCoren();

  // Verifica qual login o usuário escolheu para fazer,
  // definindo qual validador será usado(CPF/COREN)
  if (identifierInput.attr("name") === "coren") {
    if (testIdentifier) {
      identifierInput = identifierInput.val();
    }
  } else {
    testIdentifier = validateCPF();
    if (testIdentifier) {
      identifierInput = identifierInput.val();
      userType = "NORMAL USER";
    }
  }

  // Verifica se o CPF/COREN passou no validador, para só
  // então enviar para a função de login através de conexão com o back-end
  if (testIdentifier) {
    let loginData = {
      type: userType,
      identifier: identifierInput.toUpperCase(),
      password: passwordInput,
    };

    return loginData;
  }
}

function verifyFormFields() {
  let inputs = $(".enable-input");
  let validCounter = 0;

  inputs.each(function (index, element){
    if($(element).val() === "" || $(element).val() === "selected"){
      $(element).next().text("Campo obrigatório!");
      $(element).addClass("border-danger");
    }else{
      $(element).next().text("");
      $(element).addClass("border-success");
      $(element).removeClass("border-danger");
      validCounter++;
    }
  });

  return validCounter === inputs.length;
}

function getVaccineValidatedData() {
  let vaccineData = {};
  const isAllFill = verifyFormFields();

  if (isAllFill) {
    $(".enable-input").each(function (index, element) {
      vaccineData[$(element).attr("name")] = $(element).val().toUpperCase();
    });

    return vaccineData;
  }
}

function getVaccinationValidatedData() {
  let vaccinationData = {};
  const isAllFill = verifyFormFields();

  if (isAllFill) {
    $(".enable-input").each(function (index, element) {
      vaccinationData[$(element).attr("name")] = $(element).val().toUpperCase();
    });
  }else{
    return;
  }

  checkPacientCpf();
  checkVaccine();

  let dataTest = [$("#CPF").hasClass("border-success"), $("#vaccine-name").hasClass("border-success")];

  if (dataTest.every((teste) => teste)) {
    return vaccinationData;
  }
}

export {
  validateCPF,
  checkPacientCpf,
  checkVaccine,
  getUserValidatedData,
  getLoginData,
  getVaccineValidatedData,
  getVaccinationValidatedData,
};
