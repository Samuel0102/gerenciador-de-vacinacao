# :syringe: Sistema Único de Vacinação - SUV :syringe:
Projeto de um sistema CRUD em Flask, para controlar vacinas e vacinações de cidadãos.  
:link: https://sistema-unico-vacinacao.herokuapp.com/


# Sobre o projeto

## Introdução
O SUV(Sistema Único de Vacinação) é inicialmente definido como um sistema base para gerenciamento de vacinas e vacinações. Em trabalho com processos de consulta de banco e definição de rotas de views, o projeto visa ser capaz de armazenardados de usuários a serem vacinados, usuários a vacinar, a própria vacinação e as vacinas utilizadas, como objeto de referência, no processo. A principal aposta do SUV é se compreender como um projeto que encontre base na necessidade atual da virtualização e digitalização de processos, até então, materialistas e arcaicos. O armazenamento de dados tão importantes, como os de vacinações, ainda sujeitam-se a perdas e obstruções quando guardados em documentos físicos, por exemplo. Tendo seu armazenamento em uma nuvem, a integridade desses dados teria mais chances de continuar intacta.

## Especificações
*Autores*: Samuel Pacheco Ferreira, Maria Erbs Pereira e Thaís Letícia Junkes.      
*Descrição*: Projeto de controle de vacinas e vacinações.  
*Andamento*: Em desenvolvimento.    
*Terá atualizações*: Sim.        

## Tecnologias
*Tecnologias utilizadas*: HTML, CSS, BOOTSTRAP, Flask, Javascript e JQuery.      
*IDE*: Visual Studio Code.      
*Estruturação*: Estruturado em HTML, tendo seu back-end fundamentado em Flask e sua arquitetura sendo o padrão MVC (Model-View-Controller).    

## Funcionalidades
| Funcionalidade | Situação |
| ----------- | ----------- |
| Cadastro de usuários pacientes e enfermeiros | :heavy_check_mark: |
| Possibilidade de exclusão dos cadastros de usuários| :heavy_check_mark: |
| Possibilidade de alteração dos dados de cadastro dos usuários| :heavy_check_mark: |
| Envio de pdf com vacinações ao usuário comum ao excluir a conta| :heavy_check_mark: |
| Cadastro de vacinas | :heavy_check_mark: |
| Cadastro de vacinação de usuários paciente | :heavy_check_mark: |
| Login de usuários | :heavy_check_mark: |
| Acesso dos usuários a seus dados pessoais | :heavy_check_mark: |
| Logout dos usuários | :heavy_check_mark: |
| Acesso dos usuários do tipo paciente a todas as vacinas já tomadas | :heavy_check_mark: |
| Visualização das vacinas tomadas do usuário paciente pelo super usuário no ato de cadastro de nova vacinação | :heavy_check_mark: |
| Envio de email de boas-vindas ao novo usuário cadastrado| :heavy_check_mark: |

:clock130: - Em desenvolvimento   :heavy_check_mark: - Finalizado

## Requisitos para manipular código
* Instalação de todas as dependências especificadas no arquivo "requirements.txt", além de Python 3.8 

## Execução do sistema
1. Baixe o zip do repositório
2. Na pasta raíz "sistema_de_vacinacao-master", crie um ambiente virtual  
2.1 A criação pode ser feita baixando a biblioteca "virtualenv" e executando na raíz o comando `virtualenv -p python ambiente_virtual`
3. Dentro do ambiente virtual, execute o comando `pip install -r requeriments.txt` que fará a instalação de todas as dependências necessárias   
3.1 O acesso ao ambiente pode ser feito digitando na raíz o comando `. ambiente_virtual/bin/activate`, fazendo o ambiente ativar  
3.1.1 Para desativar: `deactivate`
4. Com todas as dependências instaladas, basta executar o script "run_server.py" que contém o inicializador do sistema e do servidor  
4.1 Para execução é necessário, após instalar dependências e ambiente virtual, trocar o interpretador do python padrão para o interpretador "venv". No VSCODE, graças ao diretório ".vscode" é possível apenas clicando no canto inferior esquerdo, onde encontra-se a versão do python. Ao clicar, basta escolher o interpretador, na tela que aparecer no topo, "python 3.8.5 64 bits ('venv': venv)"  
5. Com o servidor inicializado, basta digitar no navegador "localhost:5000"

## Documentações do sistema e outros arquivos
:link: Documentos complementares  (https://drive.google.com/drive/folders/1hTEUSgIIJWC7scULy46f0FoNYEwpCQf8?usp=sharing)  
:link: Documentação (https://drive.google.com/drive/folders/1P13a1iAmICIz6YUV9uLWABs-OQfDcuFC?usp=sharing)  
:link: Design e Modelagem do Banco (https://drive.google.com/drive/folders/1w-Gn851TZOCL74a2QJL_ghaPHKgFA04r?usp=sharing)

## Origem do projeto
O projeto se originou através da matéria de Projeto Integrador III, onde fora solicitado o desenvolvimento de um CRUD.      
 
## Principais dificuldades
* Primeiro grande projeto completo do curso
* Desenvolvimento em equipe mais robusto
* Dificuldade em conciliar desenvolvimento do projeto com o curso técnico e as matérias escolares





