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
