function changeRegisterForm(type){
    let corenArea = $("#user-coren");
    let cpfArea = $("#user-cpf");
    let corenInput = $("input[name='user-coren']");

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

function changeLoginForm(type){
    let identifierLabel = $(".form-label")[0];
    let identifierInput = $(".form-control")[0];

    switch(type){
        case "pacient":
            identifierLabel.innerText = "CPF";
            identifierInput.setAttribute("name", "user-cpf");
            break;
        case "nurse":
            identifierLabel.innerText = "COREN";
            identifierInput.setAttribute("name", "user-coren");
            break;
    }
}

function changeHeaderNav(){
    let userType = localStorage.getItem("userType");

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

function changeUserArea(){
    let userIcon = $("#header-user-icon");
    let userOptions = $("#user-options");
    let registerLoginButtons = $("#register-login-buttons");

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

function showUserDropdown(){
    let userDropdown = $("#dropdown-user");

    if(userDropdown.css("display") === "none"){
        userDropdown.show("slow");
    }else{
        userDropdown.hide("slow");
    }
}

function logoutUser(){
    localStorage.clear();

    setTimeout(function(){
        window.location.href = "/";
    }, 5000)
}