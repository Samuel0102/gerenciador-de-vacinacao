import { getVaccinationValidatedData, checkPacientCpf, checkVaccine } from "./utilities_script.js";

$(document).ready(function(){
  $("#coren").val(localStorage["userCoren"]);
})

$("#CPF").focusout(checkPacientCpf);

$("#vaccine-name").focusout(checkVaccine);

$("#register-vaccination").click(registerNewVaccination);

$("#dose").change(disableNextDoseDate);

$("#pacient-vaccinations").click(function(){getVaccinations("pacient")});

function registerNewVaccination(){
  const vaccinationData = getVaccinationValidatedData();
  const userNotification = $("#user-notification");

  if(vaccinationData === undefined){
    return;
  }

  $.ajax({
    type: "POST",
    url: "/vaccination-register",
    data: JSON.stringify(vaccinationData),
    dataType: "json",
    contentType: "application/json",
    success: function(response){
      if(response["result"] === "VACCINATION REGISTERED"){
        userNotification.text("Vacinação cadastrada com sucesso!");
        userNotification.addClass("text-success");
        userNotification.removeClass("text-danger");
      }else{
        userNotification.text("Houve erro no cadastro de vacinação, verifique os dados!");
        userNotification.addClass("text-danger");
      }
    },
    error: function(){
      alert("Houve um erro no sistema, por favor recarregue a página!");
    }
  })

}

function getVaccinations(type){
  let cpf = localStorage["userCpf"];

  if(type === "pacient"){
    cpf = $("#CPF").val();
  }

  $.get("/list-vaccinations/" + cpf, function(response){
      showVaccinations(response);
  });
}

function showVaccinations(vaccinations){
  let vaccinationsTableBody = $("#vaccinations-table-body"); 

  vaccinations.forEach(function(element){
    let tableRow = "<tr>";

    for(let attribute in element){
      if(element[attribute] === "0001.01.01"){
        element[attribute] = "(x)";
      }

      tableRow += `<td>${element[attribute]}</td>`;
    }

    vaccinationsTableBody.append(tableRow + "</tr>");

  });
}

function disableNextDoseDate(){
  let nextDoseInput= $("#next-date");

  if($("#dose").val() === "dose-unica"){
    nextDoseInput.prop("disabled", true);
    nextDoseInput.parent().hide();
    nextDoseInput.removeClass("enable-input");
  }else{
    nextDoseInput.prop("disabled", false);
    nextDoseInput.parent().show();
    nextDoseInput.addClass("enable-input");
  }
}

export {
  getVaccinations
};