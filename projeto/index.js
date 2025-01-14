const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB!");
        const database = client.db("projeto");
        const collection = database.collection("users");

        
         // Inserir um documento
         await collection.insertOne({ nome: "João 4", idade: 25, email: "joao@email.com"});
         console.log("Documento inserido!");
    
        const query = { nome: "João 4" };
        const user = await collection.findOne(query);
        console.log(user);

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
