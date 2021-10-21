// Os scripts de Registro e Login são relacionados aos processos de login
// e registro no sistema, bem como invocação de validação de dados

// Chamada dos métodos validadores
import {validateCoren, validateCPF, validatePassword, validateTel} from "./utilities_script.js";
    
$("#register-button").click(function(){
    getNewUserValidatedData();
})

/*  Função para obter os dados do formulário totalmente validados
    Somente gera um array de dados de usuário após todos os 4 dados
    mais sensíveis(cpf, coren, tel e password) estiverem validados */
function getNewUserValidatedData(){
    let userCPF = validateCPF();
    let userCoren = validateCoren();
    let userTel = validateTel();
    let userPassword = validatePassword();
    // Obtém os outros dados
    let otherUserData= $(".form-control");

    let completeUserData = [];

    // Verifica qual tipo de usuário será cadastrado,
    // identificando o logo no começo do array
    if(userCoren === "NORMAL USER"){
        completeUserData.push("NORMAL USER");
        userCoren = true;
    }else{
        completeUserData.push("SUPER USER");
    }

    // Verifica se todos os 4 dados sensíveis são validos,
    // se sim gera um array contendo todos os dados fornecidos
    if(userCPF && userCoren && userTel && userPassword){
        for(let i = 0; i < 8; i++){
            if(otherUserData[i].value === ""){

                // Verifica se há algum campo vazio, se sim, interrompe na primeira
                // ocorrência e alerta o usuário
                if(!otherUserData.eq(i).prop("disabled")){
                    $("#user-notification").text("Alguns formulários estão vazios!");
                    return;
                }
                
            }

            completeUserData.push(otherUserData[i].value);
        }

        // Após o laço, o array é mandado para uma função
        // de registro através de conexão com o back-end
        registerNewUser(completeUserData);
    }

}

/*  Função para formatar o array em um objeto JS e enviar para o back-end */
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
                /*  Verifica a resposta do servidor e notifica ao usuário
                se houve sucesso no cadastro, ou se aquele CPF/COREN 
                já estava registrado no banco */
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

/*  Função para verificar corretude do CPF/COREN
    do formulário de LOGIN, gerando um pequeno objeto js
    que é interpretado pelo back-end */
function getLoginData(){
    let identifierInput = $("#user-identifier");
    let passwordInput = $("#user-password").val();
    let userType = "SUPER USER";
    let testIdentifier = validateCoren();

    // Verifica qual login o usuário escolheu para fazer,
    // definindo qual validador será usado(CPF/COREN)
    if (identifierInput.attr("name") === "user-coren"){
        if(testIdentifier){
            identifierInput = identifierInput.val();
        }

    }else{
        testIdentifier = validateCPF();
        if(testIdentifier){
            identifierInput = identifierInput.val();
            userType = "NORMAL USER";
        }
    }

    // Verifica se o CPF/COREN passou no validador, para só
    // então enviar para a função de login através de conexão com o back-end
    if(testIdentifier){
        let loginData = {
            type: userType,
            identifier: identifierInput,
            password: passwordInput
        }
    
        loggeUser(loginData);
    }
}

/*  Função para realizar login por meio de conexão com back-end 
    envia o pequeno objeto json contendo dados do login e qual 
    o tipo de usuário, a fim de facilitar busca no banco */
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
                /* Verifica se as informaçóes condizem com registro do banco,
                se sim cria uma sessão local, guardando o tipo de usuário e
                seu identificador na base de dados, além de notificar o usuário */
                case "SUCCESS LOGIN":
                    localStorage.setItem("userType", loginData["type"]);
                    localStorage.setItem("userId", response["user-id"]);
            
                    userNotification.text("Login realizado com sucesso, redirecionando...");
                    userNotification.addClass("text-success");
                    userNotification.removeClass("text-danger");

                    setTimeout(function(){
                        window.location.href = "/";
                    },4000);
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
