# Treinamento: Desenvolvimento com JavaScript e MongoDB

## Objetivo do Treinamento
Capacitar os participantes a compreenderem os conceitos fundamentais de bancos de dados não relacionais, configurar e utilizar o MongoDB, e construir APIs em JavaScript para manipulação de dados.

---
Download vscode https://code.visualstudio.com/download

## **Banco de Dados**

### **Módulo 1: Fundamentos de Bancos Relacionais e Não Relacionais**

#### O que será apresentado:
- **Conceitos básicos:**
  - O que é um banco de dados?
    - Um banco de dados é uma coleção organizada de informações ou dados que podem ser acessados, gerenciados e atualizados.
    - Exemplos: armazenar informações de usuários, catálogos de produtos, registros de vendas, etc.
  
  - **Bancos Relacionais:**
    - Estruturados em tabelas com linhas e colunas.
    - Relacionamentos claros entre os dados, definidos por chaves estrangeiras.
    - Linguagem SQL usada para manipulação e consulta.
    - Exemplo de tabela:
      ```
      Tabela: Usuarios
      | ID | Nome    | Email             |
      |----|---------|-------------------|
      | 1  | João   | joao@email.com    |
      | 2  | Maria   | maria@email.com   |
      ```

  - **Bancos Não Relacionais:**
    - Estruturados em documentos, chave-valor, colunas ou grafos. [Tipos de Bancos](https://azure.microsoft.com/pt-br/resources/cloud-computing-dictionary/what-is-nosql-database)
    - Não possuem esquemas fixos, permitindo maior flexibilidade.
    - Exemplo de documento MongoDB:
      ```json
      {
        "_id": "1",
        "nome": "João",
        "email": "joao@email.com"
      }
      ```

  - **Comparativo:**
    - Relacionais: Bons para sistemas que exigem consistência e relações complexas entre dados.
    - Não Relacionais: Indicados para sistemas com grande volume de dados, flexibilidade de esquema e escalabilidade horizontal.

---

### **Módulo 2: Configuração do Ambiente com MongoDB**

#### O que será apresentado:
- **Instalação Local:**
  - Acesse o site oficial do MongoDB e baixe o [MongoDB Community Edition](https://www.mongodb.com/try/download/community).
  - Siga o assistente de instalação:
    - No Windows: Habilite o MongoDB como serviço.
    - No Linux/Mac: Instale via terminal e configure o MongoDB como serviço.
  - Inicie o servidor MongoDB com o comando:
    ```bash
    mongod
    ```
  - Acesse o terminal do MongoDB:
    ```bash
    mongo
    ```

- **Configuração com Docker:**
  - Certifique-se de que o Docker está instalado ([Docker Desktop](https://www.docker.com/products/docker-desktop)).
  - Execute o comando para criar um contêiner:
    ```bash
    docker run --name mongodb -d -p 27017:27017 mongo
    ```
  - Para persistir os dados:
    ```bash
    docker run --name mongodb -d -p 27017:27017 -v /path/to/data:/data/db mongo
    ```

- **Conectando ao MongoDB:**
  - Usando o terminal:
    ```bash
    mongo
    ```
  - Usando ferramentas GUI:
    - [MongoDB Compass](https://www.mongodb.com/products/compass)
    - [Robo 3T](https://robomongo.org/)

#### Atividade Prática:
- Instale o MongoDB localmente ou configure-o no Docker.
- Crie um banco de dados chamado `training` e uma coleção chamada `students`:
  ```bash
  use training
  db.createCollection("students")
  ```

---

### **Módulo 3: Introdução ao MongoDB com JavaScript**

#### O que será apresentado:
- **Configuração do Projeto:**
  - Crie um diretório para o projeto e inicialize um projeto Node.js:
    ```bash
    mkdir mongo-training
    cd mongo-training
    npm init -y
    ```
  - Instale as dependências necessárias:
    ```bash
    npm install mongodb express body-parser
    ```

- **Conexão ao MongoDB:**
  - Exemplo de código para conectar ao MongoDB:
    ```javascript
    const { MongoClient } = require("mongodb");

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    async function run() {
      try {
        await client.connect();
        console.log("Conectado ao MongoDB!");
        const db = client.db("training");
        const collection = db.collection("students");
        // Inserir um documento
        await collection.insertOne({ nome: "João", idade: 25 });
        console.log("Documento inserido!");
      } finally {
        await client.close();
      }
    }

    run().catch(console.dir);
    ```

#### Atividade Prática:
- Modifique o código para inserir e listar documentos na coleção `students`.

---

### **Módulo 4: Criando uma API RESTful para CRUD**

#### O que será apresentado:

1. **Configuração Inicial do Projeto:**
   - Crie um novo projeto ou use o diretório do Módulo 3.
   - Instale o Express.js e o Body-Parser:
     ```bash
     npm install express body-parser
     ```

2. **Crie o Arquivo Principal:**
   - No diretório do projeto, crie um arquivo `index.js`.
   - Configure o servidor Express:
     ```javascript
     const express = require("express");
     const bodyParser = require("body-parser");
     const { MongoClient, ObjectId } = require("mongodb");

     const app = express();
     app.use(bodyParser.json());

     const uri = "mongodb://localhost:27017";
     const client = new MongoClient(uri);

     let db, collection;

     async function connectToDatabase() {
       await client.connect();
       db = client.db("training");
       collection = db.collection("students");
       console.log("Conectado ao MongoDB!");
     }

     connectToDatabase().catch(console.error);

     app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
     ```

3. **Endpoints CRUD:**
   - **Create (POST):**
     ```javascript
     app.post("/students", async (req, res) => {
       const { nome, idade } = req.body;
       const result = await collection.insertOne({ nome, idade });
       res.status(201).send(result);
     });
     ```

   - **Read (GET):**
     ```javascript
     app.get("/students", async (req, res) => {
       const students = await collection.find({}).toArray();
       res.status(200).send(students);
     });
     ```

   - **Update (PUT):**
     ```javascript
     app.put("/students/:id", async (req, res) => {
       const { id } = req.params;
       const { nome, idade } = req.body;
       const result = await collection.updateOne(
         { _id: new ObjectId(id) },
         { $set: { nome, idade } }
       );
       res.status(200).send(result);
     });
     ```

   - **Delete (DELETE):**
     ```javascript
     app.delete("/students/:id", async (req, res) => {
       const { id } = req.params;
       const result = await collection.deleteOne({ _id: new ObjectId(id) });
       res.status(200).send(result);
     });
     ```

4. **Teste os Endpoints:**
   - Use o [Postman](https://www.postman.com/) ou cURL para testar cada rota.

#### Atividade Prática:
- Configure todos os endpoints e teste criando, lendo, atualizando e deletando dados da coleção `students`.
- Adicione mensagens de erro para tratamentos como ID inválidos ou dados ausentes.

---

### **Módulo 5: Testando e Melhorando a API**

#### O que será apresentado:
- **Testes Básicos:**
  - Use o Postman para enviar requisições aos endpoints.

- **Melhorias na API:**
  - Adicione validação de dados com a biblioteca `Joi`.
    ```javascript
    const Joi = require("joi");

    const studentSchema = Joi.object({
      nome: Joi.string().min(3).required(),
      idade: Joi.number().integer().min(1).required()
    });

    app.post("/students", async (req, res) => {
      const { error } = studentSchema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { nome, idade } = req.body;
      const result = await collection.insertOne({ nome, idade });
      res.status(201).send(result);
    });
    ```

#### Atividade Prática:
- Adicione validação e paginação ao endpoint de listagem.

