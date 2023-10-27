const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config()


const uri =`mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.lh0lzsv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("CarDoctors");
    const ServiceCollection = database.collection("ServiceCollection");
    const productCollection = database.collection("productCollection");

    app.get("/services", async (req, res) => {
      const data = ServiceCollection.find();
      const dataCollection = await data.toArray();
      res.send(dataCollection);
    });

    app.get('/products',async(req,res)=>{
        const data=productCollection.find()
        const products=await data.toArray()
        res.send(products)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
