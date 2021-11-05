import { getVaccineValidatedData } from "./utilities_script.js";

$("#register-vaccine").click(function(){
    registerNewVaccine();
});

function registerNewVaccine(){
    let vaccineData = getVaccineValidatedData();
    let userNotification = $("#user-notification");

    if(vaccineData === undefined){
        return;
    }

    $.ajax({
        type: "POST",
        url: "/vaccine-register",
        data: JSON.stringify(vaccineData),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            if(response["result"] === "VACCINE REGISTERED"){
                userNotification.text("Vacina cadastrada com Sucesso!");
                userNotification.addClass("text-success");
            }else{
                userNotification.text("Vacina já cadastrada!");
                userNotification.addClass("text-danger");
            }
        },
        error: function(){
            alert("Houve um erro no sistema, por favor recarregue a página!");
        }
    });
}
