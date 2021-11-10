from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from fpdf import FPDF
from os import remove
import smtplib
import requests
import json

# definição das configurações do PDF a ser gerado
def define_pdf():
    pdf = FPDF()
    epw = pdf.w - 2*pdf.l_margin

    pdf.add_page()
    pdf.set_font('helvetica', 'B', 16)
    pdf.cell(epw, 10, 'Vacinações', ln=1, border=1, align='C')
    pdf.ln(5)

    return pdf, epw

# função para obter todos os dados de vacinação de um determinado paciente
# através da api 
def get_vaccinations(user_cpf):
    response = requests.get(
        "http://192.168.0.30:5000/list-vaccinations/" + user_cpf).content
    vaccinations_data = json.loads(response)

    vaccinations_data.insert(
        0, ["Data", "Dose", "Próxima Dose", "Enfermeiro", "Vacina", "Laboratório"])

    return vaccinations_data

# função para gerar o pdf em si, preenchendo a tabela com
# dados de vacinação da função get_vaccinations
def generate_vaccinations_pdf(user_cpf, user_name):
    pdf, epw = define_pdf()
    vaccinations_data = get_vaccinations(user_cpf)

    line_height = pdf.font_size * 1.5
    col_width = epw / len(vaccinations_data[0])
    for pos, row in enumerate(vaccinations_data):
        if(pos == 0):
            iterator = row
            pdf.set_font('helvetica', "B", 11)
        else:
            iterator = row.values()
            pdf.set_font('helvetica', "I", 7)

        for item in iterator:
            pdf.cell(col_width, line_height, item, border=1, align="C")

        pdf.ln(line_height)

    pdf.output(f'application/database/{user_name}_vaccinations.pdf')

# função para gerar todo o aparato necessário para enviar o email
# também chama a função para criar os dois tipos de mensagens
def send_email(type, email, user_cpf="", user_name=""):
    # mensagem do email
    msg = MIMEMultipart()

    # definição dos emails do processo
    msg['From'] = "SUV <sistema.unico.vacinacao@gmail.com>"
    msg['To'] = email

    # start do server responsável pelo envio 
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login("sistema.unico.vacinacao@gmail.com", "_suvpassword123")

    # criação do corpo do email
    make_msg(type, msg, user_cpf, user_name)

    # envio do email e desligamento do servidor
    server.sendmail(msg['From'], msg['To'], msg.as_string())
    server.quit()

    # exclusão do arquivo de pdf do usuário
    if(type == "send_pdf"):
         remove(f'application/database/{user_name}_vaccinations.pdf')

# função para gerar o corpo do email, sendo esse ou pdf ou mensagem de boas
# vinda
def make_msg(type, msg, user_cpf, user_name):
    if(type == "send_pdf"):
        # definição do assunto
        msg['Subject'] = "PDF de Vacinações"
        # criação e abertura do pdf
        generate_vaccinations_pdf(user_cpf, user_name)
        pdf = MIMEApplication(
        open(f"application/database/{user_name}_vaccinations.pdf", 'rb').read())
        # adição das informações a aparecerem sobre o pdf e anexagem ao
        # corpo do email
        pdf.add_header('Content-Disposition', 'attachment',
                   filename="minhas_vacinacoes.pdf")
        msg.attach(pdf)

    if(type == "success_register"):
        msg['Subject'] = "Aviso de Cadastro"
        # definição da mensagem e anexagem ao corpo do email
        message = f"Olá, {user_name}! Seu cadastro foi feito com sucesso! Seja bem vindo ao SUV!"
        msg.attach(MIMEText(message, "plain"))