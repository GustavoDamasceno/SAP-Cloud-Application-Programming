# SAP-Cloud-Application-Programming
Criando uma aplicação SAP Cloud Application Programming Model (CAP) no visual studio com a utilização de CDS (Core Data Services), e a abordagem de serviços e eventos.

## 1. Pré-requisitos

Certifique-se de que você tem o seguinte instalado/configurado no seu ambiente:

- **Node.js** (versão LTS recomendada)  
- **@sap/cds-dk**: Instale globalmente o CAP CLI.

```bash
npm install -g @sap/cds-dk
```
- Extensões necessárias do VS Code: **SAP Fiori Tools Extension Pack** e **SAP CDS Language Support**
-	Conta na SAP BTP (caso precise de serviços no BTP).
-	SQLite como banco local para testes, se necessário.

## 2. Criar o projeto CAP no VS Code
### 2.1 Criar um novo projeto CAP
  
  No terminal do VS Code, execute:

  ```bash
  cds init my-cap-project
  cd my-cap-project
  ```
Isso criará uma estrutura básica do projeto CAP, certifique-se que tenha essa estrutura:

```bash
  my-cap-project/
  ├── app/
  ├── db/
  ├── srv/
  ├── package-lock.json
  ├── package.json
  ├── README.md
```
### 2.2 Adicionar o modelo de dados

Navegue até a pasta db/ crie o arquivo _schema.cds_:

```cds
namespace mydb;

entity Products {
    key ID : Integer;
    name : String;
    description : String;
    price : Decimal;
}
```
Isso define uma simples entidade Products como exemplo.

### 2.3 Definir o serviço OData

Na pasta srv/, crie o arquivo _service.cds_:

```cds
using mydb from '../db/schema';

service CatalogService {

    entity Products as projection on mydb.Products;
    annotate Products with @odata.draft.enabled;
}
```

### 2.4 Instalar as dependências

Agora, precisa instalar as dependências do projeto que estão no arquivo _package.json_. Para isso, basta executar no terminal:

```bash
npm install
```
E com isso, você já pode executar o serviço CAP. Basta digitar o comando abaixo no terminal:

```bash
cds watch
```
Ao rodar o comando você verá que o serviço irá dizer o link fornecido que você acessará:

```bash
[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 28/11/2024, 01:14:45, version: 8.5.0, in: 559.717ms
[cds] - [ terminate with ^C ]
```
no meu caso, basta abrir _http://localhost:4004_. Note que não tem nenhum web applications e tem um service endpoints chamado _Products_.

![](https://media.discordapp.net/attachments/632579623569457152/1311547396437708810/image.png?ex=6759bbf2&is=67586a72&hm=1baa8a7265148923de1c14e4138aaf5f4a5905cdd845cc70e4126a11678cdd46&=&format=webp&quality=lossless&width=1025&height=348)

Você pode acessar o service enpoint _Products_ fazendo uma requisição _GET_ em _http://localhost:4004/odata/v4/catalog/Products_ porém não vai ter dados e vai te retornar o seguinte:

```json
{
  "@odata.context": "$metadata#Products",
  "value": []
}
```
Então vamos precisar conectar com o SQLITE e depois vamos criar uma aplicação web.

## 3. Criar o banco de dados e populá-lo com dados

O CAP se conecta ao banco de dados automaticamente, mas você pode precisar adicionar algum script para inicializar o banco com dados.

### 3.1 Criar o banco de dados e populá-lo:

No seu terminal, navegue até a pasta do seu projeto CAP e execute:

```bash
cds deploy --to sqlite:db.sqlite
```

Isso criará o banco de dados _SQLite_ na pasta do seu projeto, com base no modelo definido no _schema.cds_. Se o banco de dados já existir, ele será atualizado.

### 3.2 Adicionar dados iniciais ao banco de dados (opcional):

Agora, navegue até sua pasta db/ e crie uma pasta chamada data, sua estrutura ficará assim:

```bash
  my-cap-project/
  ├── app/
  ├── db/
      ├── data/
  ├── srv/
  ├── package-lock.json
  ├── package.json
  ├── README.md
```
E dentro da sua pasta data/ crie um arquivo _.csv_ para adicionar dados ao banco. Detalhe super importante, ao criar o arquivo o nome dele precisa ser _[nome do namespace].[nome da entidade].csv_, pois como dito anteriormente a extensão do SAP CAP já conecta com o sqlite automaticamente. Nesse exemplo o nome da aplicação será _mydb.Products.csv_

Ao criar o arquivo você pode popular ele, segue um modelo de exemplo:

```csv
ID,name,description,price
1,Coca-Cola 350ml,Refrigerante de cola clássico com 350ml,4.50
2,Coca-Cola 2L,Refrigerante de cola clássico com 2L,9.99
3,Fanta Laranja 350ml,Refrigerante de laranja saboroso com 350ml,4.20
4,Fanta Laranja 2L,Refrigerante de laranja com 2L,8.90
5,Sprite 350ml,Refrigerante de limão e laranja com 350ml,4.40
6,Sprite 2L,Refrigerante de limão e laranja com 2L,9.50
7,Coca-Cola Diet 350ml,Refrigerante de cola sem açúcar com 350ml,4.80
8,Coca-Cola Diet 2L,Refrigerante de cola sem açúcar com 2L,10.20
9,Coca-Cola Zero 350ml,Refrigerante de cola sem calorias com 350ml,4.90
10,Coca-Cola Zero 2L,Refrigerante de cola sem calorias com 2L,10.50
11,Coca-Cola Zero 500ml,Refrigerante de coca cola zero com 500ml,5.50
```

E com isso, já podemos executar o serviço CAP novamente. Basta digitar o comando abaixo no terminal:

```bash
cds watch
```
abrir o _localhost_ e já vamos acessar o service enpoint _Products_ fazendo uma requisição _GET_ em _http://localhost:4004/odata/v4/catalog/Products_ lembra que estava vazia? pois ao faer a requisição verá os dados lá:

```json
{
  "@odata.context": "$metadata#Products",
  "value": [
    {
      "ID": 1,
      "name": "Coca-Cola 350ml",
      "description": "Refrigerante de cola clássico com 350ml",
      "price": 4.5,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 2,
      "name": "Coca-Cola 2L",
      "description": "Refrigerante de cola clássico com 2L",
      "price": 9.99,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 3,
      "name": "Fanta Laranja 350ml",
      "description": "Refrigerante de laranja saboroso com 350ml",
      "price": 4.2,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 4,
      "name": "Fanta Laranja 2L",
      "description": "Refrigerante de laranja com 2L",
      "price": 8.9,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 5,
      "name": "Sprite 350ml",
      "description": "Refrigerante de limão e laranja com 350ml",
      "price": 4.4,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 6,
      "name": "Sprite 2L",
      "description": "Refrigerante de limão e laranja com 2L",
      "price": 9.5,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 7,
      "name": "Coca-Cola Diet 350ml",
      "description": "Refrigerante de cola sem açúcar com 350ml",
      "price": 4.8,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 8,
      "name": "Coca-Cola Diet 2L",
      "description": "Refrigerante de cola sem açúcar com 2L",
      "price": 10.2,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 9,
      "name": "Coca-Cola Zero 350ml",
      "description": "Refrigerante de cola sem calorias com 350ml",
      "price": 4.9,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 10,
      "name": "Coca-Cola Zero 2L",
      "description": "Refrigerante de cola sem calorias com 2L",
      "price": 10.5,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    },
    {
      "ID": 11,
      "name": "Coca-Cola Zero 500ml",
      "description": "Refrigerante de coca cola zero com 500ml",
      "price": 5.5,
      "HasActiveEntity": false,
      "HasDraftEntity": false,
      "IsActiveEntity": true
    }
  ]
}
```
## 4. Criar aplicação web

Bem, até esse momento criamos e configuramos nossos services endpoints. Mas, precisamos criar nossa aplicação web e para isso vamos gerar o projeto fiori.

### 4.1 Gerar o projeto Fiori:

Antes da gente criar o projeto fiori é necessário instalar o _Yeoman_ e o _Fiori Generator_. Abra o terminal e instale o Yeoman globalmente:

```bash
npm install -g yo
```

Após a instalação do _Yeoman_ instale o _Fiori Generator_

```bash
npm install -g @sap/generator-fiori
```
Esses pacotes permitem que você use o comando _yo_ para gerar o aplicativo Fiori Elements.

### 4.2 Gerando o aplicativo Fiori Elements:

Após as instalações, vamos executar o comando

```bash
yo @sap/fiori
```
Agora o assistente interativo irá abrir no terminal permitindo que você crie o aplicativo Fiori consumindo o serviço _OData_ do seu projeto CAP.

Primeiro, ele irá perguntar qual modelo você deseja usar, conforme abaixo:

```bash
? Which template do you want to use?
  Basic
  Custom Page
❯ List Report Page
  Overview Page
  Analytical List Page
  Form Entry Object Page
  Worklist Page
```
Você desse a setinha até _List Report Page_ e aperte `Enter`.

Em seguida, ele irá perguntar qual data source:

```bash
? Data source
  Connect to a System
  Connect to an OData Service
  Connect to SAP Business Accelerator Hub
❯ Use a Local CAP Project
  Upload a Metadata Document
```
Novamente você desse a setinha só que agota até Use a Local CAP Project e aperte `Enter`.

Depois ele perguntará o seu projeto CAP. E você seleciona o _my-cap-project_ que é o qual estamos criando, conforme ilustra abaixo

```bash
? Choose your CAP project (Use arrow keys)
❯ my-cap-project 
  Manually select CAP project folder path 
```
O assistente, continuará fazendo perguntas relacionadas ao seu projeto para criar a aplicação web. Abaixo, vou deixar todas as perguntas e respostas que coloquei para esse exemplo:

```bash
? Which template do you want to use? List Report Page
[2024-11-29 09:42:36] INFO: Warning: caching is not supported
? Data source Use a Local CAP Project
? Choose your CAP project my-cap-project
? OData service CatalogService (Node.js)
[2024-11-29 09:42:41] INFO: @sap-ux/project-access:getCapModelAndServices - Using 'cds.home': C:\Users\gdcampos\Documents\SAP CLASS\my-cap-project\node_modules\@sap\cds
[2024-11-29 09:42:41] INFO: @sap-ux/project-access:getCapModelAndServices - Using 'cds.version': 8.5.0
[2024-11-29 09:42:41] INFO: @sap-ux/project-access:getCapModelAndServices - Using 'cds.root': C:\Users\gdcampos\Documents\SAP CLASS\my-cap-project
[2024-11-29 09:42:41] INFO: @sap-ux/project-access:getCapModelAndServices - Using 'projectRoot': C:\Users\gdcampos\Documents\SAP CLASS\my-cap-project
? Main entity Products
? Automatically add table columns to the list page and a section to the object page if none already exists? Yes
? Table type Responsive
? Module name project1
? Application title produtosapp
? Application namespace solar
? Description aplicação teste
? Minimum SAPUI5 version 1.130.2 - (Maintained version)
? Add FLP configuration No
? Configure advanced options No
```

Com isso, você poderá navegar até sua pasta app/ e notará que foi criado seu código fonte da aplicação web

```bash
  my-cap-project/
  ├── app/
      ├── project1/
      ├── services.cds
```

Bem, vamos rodar nossa aplicação. Abra seu terminal e digite

```bash
cds watch
```
Abra seu localhost e note, que onde estava _none_ lá em aplicação web, agora tem a aplicação que geramos

![](https://media.discordapp.net/attachments/632579623569457152/1312039171950379120/image.png?ex=67598bb3&is=67583a33&hm=ba21a1227b5e04fba8cd9f3411780c5020e15265feb69b5e821a8a5068014345&=&format=webp&quality=lossless&width=911&height=441)

Agora, só acessar o serviço e ai está

![](https://media.discordapp.net/attachments/632579623569457152/1312039888287301662/image.png?ex=67598c5d&is=67583add&hm=f269c12152c0b74bd9f954df5af0db53f4ee37d7b29e4e86bd3bcd82ab473860&=&format=webp&quality=lossless&width=885&height=441)

Enfim, seu projeto já está no esquema para começar a trabalhar nele. Bom trabalho, ou boa sorte se for o caso.

E caso, queira deixar o desenvolvimento low code, assim como no business studio application para utilizar a ferramenta na qual foi comentada no começo da documentação **SAP Fiori Tools Extension Pack**. E clique na ferramenta lateral da extensõa SAP Fiori, como na imagem abaixo:

![](https://media.discordapp.net/attachments/632579623569457152/1313214976357306368/image.png?ex=67593580&is=6757e400&hm=a12adf89b2de198b67070bb6eca04f34508b8cc8a0ff748fb797fdc3b6a76575&=&format=webp&quality=lossless&width=785&height=441)
