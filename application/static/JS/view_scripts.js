// Os Scripts de VIEW são responsáveis pelo dinanismo do front-end,
// relacionados a exibição ou não de elementos

/*  Função para modificar o formulário de registro,
    se o usuário escolher cadastro como paciente,
    o campo coren será desabilitado */
function changeRegisterForm(type){
    let corenArea = $("#user-coren");
    let cpfArea = $("#user-cpf");
    let corenInput = $("input[name='user-coren']");

    // Bloco switch pra controlar a visualização do campo coren
    switch(type){
        case "pacient":
            corenArea.hide();
            cpfArea.removeClass("col-md-5");
            cpfArea.addClass("col-md-11");
            corenInput.prop("disabled", true);
            break;
        case "nurse":
            corenArea.show();
            cpfArea.removeClass("col-md-11");
            cpfArea.addClass("col-md-5");
            corenInput.prop("disabled", false);
            break;
    }
}

/*  Função para modificar o formulário de login
    alterando o label e o valor do placeholder */
function changeLoginForm(type){
    let identifierLabel = $(".form-label")[0];
    let identifierInput = $(".form-control")[0];

    // Bloco switch para manipular elemento label e atributo placeholder
    switch(type){
        case "pacient":
            identifierLabel.innerText = "CPF";
            identifierInput.setAttribute("name", "user-cpf");
            identifierInput.setAttribute("placeholder", "XXX.XXX.XXX-XX");
            break;
        case "nurse":
            identifierLabel.innerText = "COREN";
            identifierInput.setAttribute("name", "user-coren");
            identifierInput.setAttribute("placeholder", "coren-UF xxx-categoria");
            break;
    }
}

/*  Função executada em todas as páginas, é responsável
    por controlar a exibição dos itens do menu do cabeçalho, 
    impedindo que usuários do tipo comum(pacientes) consigam
    ver links de acesso restrito a super usuários(enfermeiros) */
function changeHeaderNav(){
    // Obtém a sessão local que armazena o tipo de usuário da sessãoa atual
    let userType = localStorage.getItem("userType");

    // Bloco switch controlando a visibilidade dos links
    switch(userType){
        case "SUPER USER":
            $("#vaccination-item").show();
            $("#vaccine-item").show();
            break;
        default:
            $("#vaccination-item").hide();
            $("#vaccine-item").hide();
            break;

    }
    
    changeUserArea();
}

/*  Função executada em todas as páginas, responsável por
    fornecer ou opções para usuários logados ou opção de 
    cadastrar e logar para usuários anônimos */
function changeUserArea(){
    let userIcon = $("#header-user-icon");
    let userOptions = $("#user-options");
    let registerLoginButtons = $("#register-login-buttons");

    // Verifica se há valores numa sessão local, isto é
    // se há algum usuário logado
    if(localStorage.length > 0){
        userIcon.attr("class", "fas fa-user-circle display-4 d-none d-sm-block");
        userOptions.show();
        registerLoginButtons.hide();
    }else{
        userIcon.attr("class", "");
        userOptions.hide();
        registerLoginButtons.show();
    }
}


/*  Função para controlar visibilidade do sub-menu
    do ícone de usuários logados, permitindo o acesso
    a página do perfil e das vacinações, além da opção 
    de deslogar */
function showUserDropdown(){
    let userDropdown = $("#dropdown-user");

    if(userDropdown.css("display") === "none"){
        userDropdown.show("slow");
    }else{
        userDropdown.hide("slow");
    }
}

/*  Função para deslogar usuários logados
    apenas limpando a sessão local e após redirecionando */
function logoutUser(){
    localStorage.clear();

    setTimeout(function(){
        window.location.href = "/";
    }, 5000)
}