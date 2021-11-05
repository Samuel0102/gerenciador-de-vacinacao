import { getVaccinationValidatedData, checkPacientCpf, checkVaccine } from "./utilities_script.js";

$(document).ready(function(){
  $("#coren").val(localStorage["user-coren"]);
})

$("#CPF").focusout(checkPacientCpf);

$("#vaccine-name").focusout(checkVaccine);

$("#register-vaccination").click(registerNewVaccination);

$("#dose").change(disableNextDoseDate);


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
        console.log("s");
      }else{
        console.log("b");
      }
    },
    error: function(){
      alert("Houve um erro no sistema, por favor recarregue a página!");
    }
  })

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