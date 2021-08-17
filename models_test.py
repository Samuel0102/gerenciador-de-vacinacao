from application.models.models import Vacina, Vacinacao, Paciente, Enfermeiro

if __name__ == "__main__":
    #instanciação das classes para teste
    vacina1 = Vacina("Coronavac","21/01/2004","Butantan")

    enfermeiro1 = Enfermeiro("Claudio", "12/01/1995","214.234.234-22","COREN-SP123.523-TE",
    "(47) 99954-3456","claudio@gmail.com","MASC","123")

    paciente1 = Paciente("José","12/01/1992","224.223.254-22","(47) 99954-3253",
    "jose@gmail.com","MASC","123")

    vacinacao = Vacinacao("21/01/2021", "21/02/2021", 1, vacina1, paciente1,
     enfermeiro1)

    #confirmação do funcionamento dos dados dos objetos
    print(f"O enfermeiro {vacinacao.enfermeiro.nome}",
    f"vacinou {vacinacao.paciente.nome}", f"na data de {vacinacao.data}.")