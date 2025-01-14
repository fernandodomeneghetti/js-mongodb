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

app.get("/students", async (req, res) => {
    const students = await collection.find({}).toArray();
    res.status(200).send(students);
  });

  app.get("/students/:nome", async (req, res) => {
    const { nome } = req.params;
    const student = await collection.findOne({ nome });
    if (student) {
      res.status(200).send(student);
    } else {
      res.status(404).send({ message: "Estudante não encontrado" });
    }
  });

app.post("/students", async (req, res) => {
    const { nome, idade } = req.body;
    const result = await collection.insertOne({ nome, idade });
    res.status(201).send(result);
});

app.put("/students/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, idade } = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome, idade } }
    );
    res.status(200).send(result);
  });

  app.delete("/students/:id", async (req, res) => {
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).send(result);
  });



app.listen(3000, () => console.log("Servidor rodando na porta 3000"));