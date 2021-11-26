/*  Módulo para mascaras de formulários de registro e conta */

$("#CPF").on("keypress", cpfFormatter);
$("#coren").on("keypress", corenFormatter);
$("#tel").on("keypress", telFormatter);

// formatação de CPF
function cpfFormatter() {
  let cpf = $("#CPF");
  const len = cpf.val().length + 1;

  cpf.val(cpf.val().replace(/\D/g, ""));

  if (len > 15) cpf.val(cpf.val().substring(0, 13));
  if (len === 12) cpf.val(cpf.val() + "-");
  if ((len % 4 === 0) & (len < 12)) cpf.val(cpf.val() + ".");
}

// formatação de coren
function corenFormatter() {
  let coren = $("#coren");
  const len = coren.val().length;

  if (len === 5 || len === 12) coren.val(coren.val() + "-");
  if (len > 17) coren.val(coren.val().substring(0,17))
}

// formatação de telefone
function telFormatter() {
  let tel = $("#tel");

  tel.val(
    tel
      .val()
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{3})(\d)/, "$1-$2")
  );

}
