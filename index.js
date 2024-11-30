const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// use middelWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oo75q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // Coffee get
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // FindOut One coffee
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(quarry);
      res.send(result);
    });

    // Coffee post
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // coffee update
    app.put(`/coffee/:id`, async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee=req.body;
      const coffee={
        $set:{
          name:updatedCoffee.name,
          price:updatedCoffee.price,
          test:updatedCoffee.test,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo
        }
      }
      const result=await coffeeCollection.updateOne(quarry, coffee,options)
      res.send(result)
    });

    // Coffee Delete
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(quarry);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// root file
app.get("/", (req, res) => {
  res.send("Coffee making server is running");
});

app.listen(port, () => {
  console.log(`server runnig on port ${port}`);
});
