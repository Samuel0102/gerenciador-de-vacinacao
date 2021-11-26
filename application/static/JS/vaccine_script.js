import { getVaccineValidatedData, showResult } from "./utilities_script.js";

$("#register-vaccine").click(registerNewVaccine);
$("#fabrication").on("keypress", (e) => {
  if(e.key === "Enter") registerNewVaccine;
})

/*  Função para cadastrar nova vacina */
function registerNewVaccine() {
  let vaccineData = getVaccineValidatedData();
  let userNotification = $("#user-notification");

  if (vaccineData === undefined) {
    return;
  }

  $.ajax({
    type: "POST",
    url: "/vaccine-register",
    data: JSON.stringify(vaccineData),
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response["result"] === "VACCINE REGISTERED") {
        showResult(
          "notification",
          true,
          userNotification,
          "Vacina cadastrada com sucesso!"
        );
      } else {
        showResult(
          "notification",
          false,
          userNotification,
          "Vacina já cadastrada!"
        );
      }
    },
    error: function () {
      alert("Houve um erro no sistema, por favor recarregue a página!");
    },
  });
}
