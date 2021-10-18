import {validateCoren, validateCPF, validatePassword, validateTel} from "./utilities_script.js";
    
$("#submit-button").click(function(){
    getUserValidatedData();
})

function getUserValidatedData(){
    let userCPF = validateCPF();
    let userCoren = validateCoren();
    let userTel = validateTel();
    let userPassword = validatePassword();
    let otherUserData= $(".form-control");

    let completeUserData = [];

    if(userCoren === "NORMAL USER"){
        completeUserData.push("NORMAL USER");
        userCoren = true;
    }else{
        completeUserData.push("SUPER USER");
    }

    if(userCPF && userCoren && userTel && userPassword){
        for(let i = 0; i < 8; i++){
            completeUserData.push(otherUserData[i].value);
        }

        registerNewUser(completeUserData);
    }

}

function registerNewUser(completeData){
    const formattedUserData = {
        type: completeData[0],
        name: completeData[1],
        born: completeData[2],
        cpf: completeData[3],
        coren: completeData[4],
        tel: completeData[5],
        genre: completeData[6],
        email: completeData[7],
        password: completeData[8]
    };

    const userNotification = $("#user-notification");

    $.ajax({
        type: "POST",
        url: "/user-register",
        data: JSON.stringify(formattedUserData),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            userNotification.empty();
            switch(response['result']){
                case "CPF/COREN IN USE":
                    userNotification.append("CPF/Coren já cadastrado!");
                    userNotification.addClass("text-danger");
                    userNotification.removeClass("text-success");
                    break;
                case "USER REGISTERED":
                    userNotification.append("Cadastro feito com sucesso!");
                    userNotification.addClass("text-success");
                    userNotification.removeClass("text-danger");
                    break;
                    
            }
        },
        error: function(){
            alert("Houve uma falha no sistema, por favor recarregue a página!")
        }
    });
}
