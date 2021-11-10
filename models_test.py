from application.models.models import Vaccine, Vaccination, Nurse, Pacient

if __name__ == "__main__":
    #instanciação das classes para teste
    vaccine1 = Vaccine("Coronavac","21/01/2004","Butantan")

    nurse1 = Nurse("Claudio", "12/01/1995","214.234.234-22","COREN-SP123.523-TE",
    "(47) 99954-3456","claudio@gmail.com","MASC","123")

    pacient1 = Pacient("José","12/01/1992","224.223.254-22","(47) 99954-3253",
    "jose@gmail.com","MASC","123")

    vaccination = Vaccination("21/01/2021", "21/02/2021", 1, vaccine1, pacient1,
     nurse1)

    #confirmação do funcionamento dos dados dos objetos
    print(f"O enfermeiro {vaccination.nurse.name}",
    f"vacinou {vaccination.pacient.name}", f"na data de {vaccination.date}.")