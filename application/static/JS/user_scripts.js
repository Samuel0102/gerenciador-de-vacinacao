import {validateCoren, validateCPF, validatePassword, validateTel} from "./utilities_script.js";
    
$("#register-button").click(function(){
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
            if(otherUserData[i].value === ""){
                $("#user-notification").text("Alguns formulários estão vazios!");
                return;
            }

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
                    userNotification.text("CPF/Coren já cadastrado!");
                    userNotification.addClass("text-danger");
                    userNotification.removeClass("text-success");
                    break;
                case "USER REGISTERED":
                    userNotification.text("Cadastro feito com sucesso!");
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

$("#login-button").click(function(){
    getLoginData();
})

function getLoginData(){
    let identifierInput = $("#user-identifier");
    let passwordInput = $("#user-password").val();
    let userType = "SUPER USER";
    let test = validateCoren();
    let loginData = {}

    if (identifierInput.attr("name") === "user-coren"){
        if(test){
            identifierInput = identifierInput.val();
        }

    }else{
        test = validateCPF();
        if(test){
            identifierInput = identifierInput.val();
            userType = "NORMAL USER";
        }
    }

    if(test){
        loginData = {
            type: userType,
            identifier: identifierInput,
            password: passwordInput
        }
    
        loggeUser(loginData);
    }
}

function loggeUser(loginData){
    const userNotification = $("#user-notification");
    $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify(loginData),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            switch(response["result"]){
                case "SUCCESS LOGIN":
                    localStorage.setItem("userType", loginData["type"]);
                    localStorage.setItem("userId", response["user-id"]);
            
                    userNotification.text("Login realizado com sucesso, redirecionando...");
                    userNotification.addClass("text-success");
                    userNotification.removeClass("text-danger");

                    setTimeout(function(){
                        window.location.href = "/";
                    },8000);
                    break;

                case "INCORRECT LOGIN":
                    userNotification.text("CPF/COREN ou senha incorretos!");
                    userNotification.addClass("text-danger");
                    userNotification.removeClass("text-success");
                    break;
            }
        },
        error: function(){
            alert("Houve um erro no sistema, por favor recarregue a página!");
        }
    });

}
