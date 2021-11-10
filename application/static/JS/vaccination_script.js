import {
  getVaccinationValidatedData,
  checkPacientCpf,
  checkVaccine,
  showResult,
} from "./utilities_script.js";

// Obter coren fixo na vacinacao
$(document).ready(function () {
  $("#coren").val(localStorage["userCoren"]);
});

$("#CPF").focusout(checkPacientCpf);

$("#vaccine-name").focusout(checkVaccine);

$("#register-vaccination").click(registerNewVaccination);

$("#pacient-vaccinations").click(() => getVaccinations("pacient"));

/*  Função para cadastrar vacinação */
function registerNewVaccination() {
  const vaccinationData = getVaccinationValidatedData();
  const userNotification = $("#user-notification");

  if (vaccinationData === undefined) {
    return;
  }

  $.ajax({
    type: "POST",
    url: "/vaccination-register",
    data: JSON.stringify(vaccinationData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response["result"] === "VACCINATION REGISTERED") {
        showResult(
          "notification",
          true,
          userNotification,
          "Vacinação cadastrada com sucesso!"
        );
      } else {
        showResult(
          "notification",
          false,
          userNotification,
          "Houve erro no cadastro de vacinação, verifique os dados!"
        );
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}

/*  Função para obter todas as vacinações de determinado paciente */
function getVaccinations(type) {
  let cpf = localStorage["userCpf"];

  if (type === "pacient") {
    cpf = $("#CPF").val();
  }

  $.get("/list-vaccinations/" + cpf, (response) => showVaccinations(response));
}

/*  Função para preencher tabela de vacinações com os dados de vacinação
    do paciente */
function showVaccinations(vaccinations) {
  let vaccinationsTableBody = $("#vaccinations-table-body");
  
  vaccinationsTableBody.empty();

  vaccinations.forEach(function (element) {
    let tableRow = "<tr>";

    for (let attribute in element) {
      if (element[attribute] === "0001.01.01") {
        element[attribute] = "(x)";
      }

      tableRow += `<td>${element[attribute]}</td>`;
    }

    vaccinationsTableBody.append(tableRow + "</tr>");
  });
}

export { getVaccinations };
