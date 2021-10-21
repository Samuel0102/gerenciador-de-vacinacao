$(document).ready(function(){
    getUserAccountData();
    changeMyProfileForm();
})


/*  Função para obter dados a respeito do usuário logado
    a partir de conexão com back-end */
function getUserAccountData(){
    // Obtém dados do usuário logado atual, através da sessão local
    let userType = localStorage.getItem("userType");
    let userIdentifier = localStorage.getItem("userId");

    // Constrói URL como especificado na route
    let url = "/user-data/" + userType + "/" + userIdentifier;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            switch(response["result"]){
                /*  Em algum caso raro de mesmo na sessão local
                o id não for encontrado, ele leva o usuário para
                a página home, além de impedir acesso de usuários
                anônimos a página do perfil */
                case "USER NOT FOUND":
                    window.location.href = "/";
                    break;
                default:
                    showUserAccountData(response["result"]);
                    break;
            }
        },
        error: function(){
            alert("Houve um problema, por favor recarregue a página!")
        }
    });
}


/*  Obtendo como parâmetro os dados obtidos da função de busca de usuário
    esta função é responsável por preencher os formulários, além do box com
    nome e idade do usuário logado */
function showUserAccountData(userData){
    let inputs = $(".form-control");
    // Retorna a idade do usuário, com base em ano dado no cadastro
    let userAge = new Date().getFullYear() - parseInt(userData["born"].slice(0,5));

    // Laço que percorre todos os campos do formulário, preenchendo-os
    // com os dados obtidos na função de busca
    for(let i = 0; i < inputs.length; i++){
        let key = inputs.eq(i).attr("name");
        inputs[i].value = userData[key];

        // Devido a auto-formatação da data vindo do back-end, fora necessário
        // mudar o separador '-' por '.' no retorno de dado pelo back-end, então em js
        // precisa-se inverter para formar uma data aceita pelo campo do tipo 'date'
        if(key === "born"){
            inputs[i].value = userData["born"].replace(/[.]/ig,"-");
        }
    }
    
    // Apenas preenche o nome e idade do box
    $("#username").text(userData["name"]);
    $("#user-age").text(userAge.toString() + " Anos");
}


/* Altera o formulário de listagem dos dados para não aparecer o campo coren */
function changeMyProfileForm(){
    let corenField = $("input[name='coren']").parent();
    let cpfField = $("input[name='CPF']").parent();

    if(localStorage["userType"] === "NORMAL USER"){
        corenField.hide();
        cpfField.removeClass("col-md-6");
        cpfField.addClass("col-md-12");
    }
}
