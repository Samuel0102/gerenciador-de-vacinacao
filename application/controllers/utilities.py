from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from os import remove
from application import config
from weasyprint import HTML, CSS
import smtplib
import requests

# função para obter todos os dados de vacinação de um determinado paciente
# através da api
def get_vaccinations(user_cpf):
    response = requests.get(
        f"{config.REQUEST_IP}/list-vaccinations/" + user_cpf)
    vaccinations_data = response.json()

    return vaccinations_data

# função para gerar as linhas de vacinações da tabela
def generate_tbody_rows(vaccinations):
    final_html = ""

    for i in vaccinations:
        html = "<tr>"
        for col in i:
            html += "<td>"+ i[col] +"</td>"
        html += "</tr>"
        
        final_html += html

    return final_html

# função para gerar o corpo do hmtl, contendo a tabela
def generate_html_body(tbody_rows):
    html_structure = f"""
    <h1>Minhas Vacinações</h1>
    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Dose</th>
                <th>Próxima Dose</th>
                <th>Enfermeiro</th>
                <th>Vacina</th>
                <th>Laboratório</th>
            </tr>
        </thead>
        <tbody id="vaccinations-table-body">{tbody_rows}</tbody>
    </table>
    """
    return html_structure

# função para gerar a folha de estilo de estilização da tabela e da página
def generate_stylesheet():
    style = CSS(string="""
    th, td{border: 1px solid black; font-size: 14px; text-align: center; padding: 5px;}
    tbody tr:nth-child(odd){background-color: lightgrey;}
    table{border-collapse: collapse; width: 100%;}
    h1{border: 1px solid black; font-size: 18px; text-align: center; padding: 10px 0;}
    """)

    return style

# função para gerar o pdf em si, preenchendo a tabela com
# dados de vacinação da função get_vaccinations
def generate_pdf(user_cpf, user_name):
    vaccinations = get_vaccinations(user_cpf)
    tbody_rows = generate_tbody_rows(vaccinations)
    html_body = generate_html_body(tbody_rows)
    stylesheet = generate_stylesheet()

    HTML(string=html_body).write_pdf(
        f'{user_name}_vaccinations.pdf', stylesheets=[stylesheet])

# função para gerar todo o aparato necessário para enviar o email
# também chama a função para criar os dois tipos de mensagens
def send_email(type, email, user_name, user_cpf=""):
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
        remove(f'{user_name}_vaccinations.pdf')

# função para gerar o corpo do email, sendo esse ou pdf ou mensagem de boas
# vinda
def make_msg(type, msg, user_cpf, user_name):
    if(type == "send_pdf" or "success_delete"):
        # definição do assunto
        msg['Subject'] = "Finalização da Conta"
        message = f"""
            <h1>Despedida</h1>
            <span style='display:block; margin-bottom:20px;'>Olá, {user_name}</span>
            <img src='cid:img1' width=300 height=150>
            <p>
            Agradecemos a sua participação no nosso sistema e esperamos que tenha
            sido útil para você, até mais!
            </p>
            <span>Atenciosamente, Equipe SUV - Sistema Único de Vacinação</span>
        """
        if(type == "send_pdf"):
            # criação e abertura do pdf
            generate_pdf(user_cpf, user_name)
            pdf = MIMEApplication(open(f"{user_name}_vaccinations.pdf", 'rb').read())
            # adição das informações a aparecerem sobre o pdf e anexagem ao
            # corpo do email
            pdf.add_header('Content-Disposition', 'attachment',
                        filename="minhas_vacinacoes.pdf")
            msg.attach(pdf)
        
        # abrir imagem
        fp = open('application/static/IMG/adios-despedida.gif', 'rb')
        image = MIMEImage(fp.read())
        fp.close()

        # definir referência para imagem
        image.add_header('Content-ID', '<img1>')

        # anexagem
        msg.attach(image)
        msg.attach(MIMEText(message, "html"))

    if(type == "success_register"):
        msg['Subject'] = "Aviso de Cadastro"
        # definição da mensagem e anexagem ao corpo do email
        message = f"""
            <h1>Aviso de Cadastro</h1>
            <span style='display:block; margin-bottom:20px;'>Olá, {user_name}</span>
            <img src='cid:img2' width=300 height=150>
            <p>
            O seu cadastro no SUV foi feito com sucesso!<br>
            Agradecemos a participação no nosso sistema e esperamos que você consiga aproveitar
            ao máximo do que ele pode oferecer.
            </p>
            <span>Atenciosamente, Equipe SUV - Sistema Único de Vacinação</span>
        """
        # abrir imagem
        fp = open('application/static/IMG/bemvindo-15.gif', 'rb')
        image = MIMEImage(fp.read())
        fp.close()

        # definir referência para imagem
        image.add_header('Content-ID', '<img2>')

        # anexagem
        msg.attach(image)
        msg.attach(MIMEText(message, "html"))
