/*  Os Scripts Utilitários são os que definem funções úteis para
    outros módulos JS */

/* Função responsável por validar o CPF fornecido */
function validateCPF() {
  let userCPF = $("input[name='CPF']");
  // Regex para verificar o formato do dado passado, se corresponde
  // ao exigido no placeholder
  const base = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/i;
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
      showResult("input", true, $("input[name='CPF']"));
      return true;
    }
  }

  // Notifica ao usuário caso o formato esteja errado ou há problema
  // nos dígitos
  showResult(
    "input",
    false,
    $("input[name='CPF']"),
    "CPF Inválido, siga o formato xxx.xxx.xxx-xx"
  );
  return false;
}

/* Validação da senha, com base apenas na exigência de tamanho */
function validatePassword() {
  let userPassword = $("#password");
  let passwordConfirm = $("#confirmp");

  if (localStorage["userType"] !== undefined) {
    return true;
  }

  let isUserPassValid = userPassword.val().length >= 12;
  let isPassConfirmValid = userPassword.val() === passwordConfirm.val();

  // Verifica se a senha tem pelo menos 12 caracteres
  if (isUserPassValid) {
    showResult("input", true, userPassword);
  } else {
    showResult(
      "input",
      false,
      userPassword,
      "Pelo menos 12 caracteres de senha!"
    );
  }

  if (isPassConfirmValid) {
    showResult("input", true, passwordConfirm);
  } else {
    showResult("input", false, passwordConfirm, "As senhas não são iguais!");
  }

  if (isUserPassValid && isPassConfirmValid) {
    return true;
  }

  return false;
}

/*  Faz validação do formato do COREN, não de sua existência */
function validateCoren() {
  let userCoren = $("input[name='coren']");

  // Regex para validar o formato do COREN
  const base = /^coren-[a-z]{2}\s[0-9]{3}-(enf$|te$|obst$|par$)/i;

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

  let isUFValid =
    brasilStates.indexOf(userCoren.val().slice(6, 8).toUpperCase()) !== -1;
  // Verificação se o formato corresponde ao exigido
  if (formatTest) {
    // Verifica se o UF é válido e existe
    if (isUFValid) {
      showResult("input", true, userCoren);
      return true;
    } else {
      showResult("input", false, userCoren, "UF não encontrado!");
      return false;
    }
  }

  showResult(
    "input",
    false,
    userCoren,
    "COREN Inválido, siga o formato coren-uf xxx-categoria"
  );
  return false;
}

/* Validação do formato do telefone passado */
function validateTel() {
  let userTel = $("input[name='tel']");
  // Regex para validar formato
  const base = /^([0-9][0-9])\s9+([0-9]{4})-([0-9]{4}$)/i;

  let formatTest = new RegExp(base).test(userTel.val());

  // Apenas verifica se o valor passado foi validado pelo Regex
  if (formatTest) {
    showResult("input", true, userTel);
    return true;
  }

  showResult(
    "input",
    false,
    userTel,
    "Telefone inválido, siga o formato ddd 9xxxx-xxxx"
  );
  return false;
}

/*  Função para notificar successo ou falha
    na validação dos dados e nos processos */
function showResult(type = "input", result, element, message = "") {
  let className = "border";

  if (type === "notification") {
    className = "text";
    element.text(message);
  } else {
    element.next().text(message);
  }

  if (result) {
    element.addClass(`${className}-success`);
    element.removeClass(`${className}-danger`);
  } else {
    element.addClass(`${className}-danger`);
  }
}

/*  Função para verificar se paciente a cadastrar
    na vacinação existe */
function checkPacientCpf() {
  if (validateCPF()) {
    let url = "/user-data/NORMAL USER/" + $("#CPF").val();

    $.get(url, function (response) {
      if (response["result"] === "USER NOT FOUND") {
        showResult("input", false, $("#CPF"), "Paciente não existe!");
        $("#pacient-vaccinations").prop("disabled", true);
      } else {
        showPacientData(response["result"]);
        $("#pacient-vaccinations").prop("disabled", false);
      }
    });
  }
}

/*  Função para apresentar dados básicos do paciente
    na vacinação */
function showPacientData(data) {
  $("#pacient-name").text("---");
  $("#pacient-age").text("---");

  let pacientAge =
    new Date().getFullYear() - parseInt(data["born"].slice(0, 5));
  $("#pacient-name").text(data["name"]);
  $("#pacient-age").text(pacientAge + " Anos");
}

/*  Função para verificar se vacina a cadastrar
    na vacinação existe */
function checkVaccine() {
  let vaccineInput = $("#vaccine-name");

  if ($("#vaccine-name").val() === "") {
    showResult(false, vaccineInput, "Vacina não existe!");
  }

  let url = "/check-vaccine/" + $("#vaccine-name").val().toUpperCase();
  $.get(url, function (response) {
    if (response["result"] !== "VACCINE NOT FOUND") {
      showResult("input", true, vaccineInput);
    } else {
      showResult("input", false, vaccineInput, "Vacina não existe!");
    }
  });
}

/*  Função para validar dados relativos a usuários passados em inputs */
function getUserValidatedData() {
  let userData = getNotEmptyFields();

  let dataTest = [
    validateCoren(),
    validateCPF(),
    validatePassword(),
    validateTel(),
  ];

  // Com base no contador de inputs preenchidos e na validação de cpf, coren
  // e password retorna o objeto para as funções que chamarem esta função
  if (dataTest.every((teste) => teste) && userData !== undefined) {
    return userData;
  }

  return;
}

/*  Função para verificar corretude do CPF/COREN
    do formulário de LOGIN, gerando um pequeno objeto js
    que é interpretado pelo back-end */
function getLoginData() {
  let identifierInput = $("#user-identifier");
  let passwordInput = $("#user-password").val();
  let userType = "SUPER USER";
  let testIdentifier = "";

  // Verifica qual login o usuário escolheu para fazer,
  // definindo qual validador será usado(CPF/COREN)
  if (identifierInput.attr("name") === "CPF") {
    userType = "NORMAL USER";
    testIdentifier = validateCPF();
  } else {
    testIdentifier = validateCoren();
  }

  // Verifica se o CPF/COREN passou no validador, para só
  // então enviar para a função de login através de conexão com o back-end
  if (testIdentifier) {
    let loginData = {
      type: userType,
      identifier: identifierInput.val().toUpperCase(),
      password: passwordInput,
    };

    return loginData;
  }

  return;
}

/*  Função para retornar os dados se todos os inputs 
    tiverem sido preenchidos */
function getNotEmptyFields() {
  // Obtém todos os inputs, com base na classe .enable-input
  // Define o Objeto dos dados e um contador para validação
  let inputs = $(".enable-input");
  let data = {};
  let validCounter = 0;

  // laço que verifica vazio ou não seleção
  inputs.each(function (index, element) {
    if ($(element).val() === "" || $(element).val() === "selected") {
      showResult("input", false, $(element), "Campo obrigatório!");
    } else {
      showResult("input", true, $(element));
      data[$(element).attr("name")] = $(element).val().toUpperCase();
      validCounter++;
    }
  });

  // se forem preenchidos retorna o objeto contendo os valores dos inputs
  if (validCounter === inputs.length) {
    return data;
  }

  return;
}

/*  Função para retornar dados da vacina a ser cadastrada */
function getVaccineValidatedData() {
  let vaccineData = getNotEmptyFields();

  if (vaccineData !== undefined) {
    return vaccineData;
  }

  return;
}

/*  Função para retornar dados da vacinação a ser cadastrada */
function getVaccinationValidatedData() {
  let vaccinationData = getNotEmptyFields();

  checkVaccine();
  checkPacientCpf();

  let dataTest = [
    $("#vaccine-name").next().text() === "",
    $("#CPF").next().text() === "",
  ];

  if (dataTest.every((teste) => teste) && vaccinationData !== undefined) {
    return vaccinationData;
  }

  return;
}

export {
  validateCPF,
  checkPacientCpf,
  checkVaccine,
  showResult,
  getUserValidatedData,
  getLoginData,
  getVaccineValidatedData,
  getVaccinationValidatedData,
};
