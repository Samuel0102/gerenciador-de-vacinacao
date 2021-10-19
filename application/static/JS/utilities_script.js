function validateCPF(){
    let userCPF = $("input[name='user-cpf']");
    const base = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/i;
    const errorMSG = userCPF.next();

    let formatTest = new RegExp(base).test(userCPF.val());

    if(formatTest){
        userCPF = userCPF.val().replace(/[^0-9]/ig, "");

        let validateDigits = function(){
            let counter = 11;
            let resultFirstDigit = 0;
            let resultSecondDigit = 0;

            for(let i = 0; i < 9; i++){
                counter--;
                resultFirstDigit += parseInt(userCPF[i]) * counter;
            }

            counter = 12;

            for(let i = 0; i < 10; i++){
                counter--;
                resultSecondDigit += parseInt(userCPF[i]) * counter;
            }

            resultFirstDigit = (resultFirstDigit * 10 % 11).toString();
            resultSecondDigit = (resultSecondDigit * 10 % 11).toString();

            if(resultFirstDigit === 10){
                resultFirstDigit = 0;
            }

            if(resultSecondDigit === 10){
                resultSecondDigit = 0;
            }

            if(resultFirstDigit === userCPF.slice(-2, -1) && resultSecondDigit === userCPF.slice(-1)){
                return true;
            }

            return false;
        }
        
        if(validateDigits() && userCPF.split(userCPF[0]).length !== 12){
            errorMSG.text("");
            return true;
        }

    }

    errorMSG.text("CPF Inválido, siga o formato xxx.xxx.xxx-xx");
    return false;
    
}

function validatePassword(){
    let userPassword = $("#user-password");
    let passwordConfirm = $("#user-confirmp");
    let errorMSGPass = userPassword.next();
    let errorMSGConfirm = passwordConfirm.next();

    if(userPassword.val().length >= 12){
        if(userPassword.val() !== passwordConfirm.val()){
            errorMSGConfirm.text("As senhas não são iguais!");
            return false;
        }else{
            errorMSGPass.text("");
            errorMSGConfirm.text("");
            return true;
        }        
    }

    errorMSGPass.text("Pelo menos 12 caracteres de senha!");
    return false;

}

function validateCoren(){
    let userCoren = $("input[name='user-coren']");

    if(userCoren.prop("disabled")){
        return "NORMAL USER";
    }

    const base = /^coren-[a-z]{2}\s[0-9]{3}-(enf$|te$|obst$|par$)/i;
    const errorMSG =  userCoren.next();

    let formatTest = new RegExp(base).test(userCoren.val());

    const brasilStates = [
        'AC','AL','AP',
        'AM','BA','CE',
        'DF','ES','GO',
        'MA','MT','MS',
        'MG','PA','PB',
        'PR','PE','PI',
        'RJ','RN','RS',
        'RO','RR','SC',
        'SP','SE','TO'
      ]

    if(formatTest){
        if(brasilStates.indexOf(userCoren.val().slice(6,8).toUpperCase()) !== -1){
            errorMSG.text("");
            return true;
        }else{
            errorMSG.text("UF não encontrado!");
            return false;
        }
    }  

    errorMSG.text("COREN Inválido, siga o formato coren-uf xxx-categoria");
    return false;
}

function validateTel(){
    let userTel = $("#user-tel");
    const base = /([0-9][0-9])9+([0-9]{4})-([0-9]{4})/i;
    const errorMSG = userTel.next();

    let formatTest = new RegExp(base).test(userTel.val().replace(" ",""));

    if(formatTest){
        errorMSG.text("");
        return true;
    }

    errorMSG.text("Formato de telefone inválido, siga o formato ddd 9xxxx-xxxx");
    return false;
}

export {validateCPF, validateCoren, validateTel, validatePassword};