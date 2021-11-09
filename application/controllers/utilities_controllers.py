from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from os import error
from fpdf import FPDF
import smtplib
import requests
import json

def generate_vaccinations_pdf(user_cpf):
    pdf = FPDF()
    epw = pdf.w - 2*pdf.l_margin

    pdf.add_page()
    pdf.set_font('helvetica', 'B', 16)
    pdf.cell(epw, 10, 'Vacinações', ln=1, border=1, align='C')
    pdf.ln(5)

    response = requests.get(
        "http://192.168.0.30:5000/list-vaccinations/" + user_cpf).content
    vaccinations_data = json.loads(response)

    vaccinations_data.insert(
        0, ["Data", "Dose", "Próxima Dose", "Enfermeiro", "Vacina", "Laboratório"])

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

    pdf.output('application/database/vaccinations_table.pdf')


def send_email(type, email, user_cpf=""):
    msg = MIMEMultipart()

    msg['From'] = "sistema.unico.vacinacao@gmail.com"
    msg['To'] = email

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(msg['From'], "_suvpassword123")

    if(type == "success_register"):
        msg['Subject'] = "Aviso de Cadastro"
        message = "Olá! Seu cadastro foi feito com sucesso! Seja bem vindo ao SUV!"
        msg.attach(MIMEText(message, "plain"))

    elif(type == "send_pdf"):
        msg['Subject'] = "PDF de Vacinações"
        generate_vaccinations_pdf(user_cpf)
        pdf = MIMEApplication(
        open("application/database/vaccinations_table.pdf", 'rb').read())
        pdf.add_header('Content-Disposition', 'attachment',
                   filename="vaccinations_table.pdf")
        msg.attach(pdf)

    server.sendmail(msg['From'], msg['To'], msg.as_string())
    server.quit()

