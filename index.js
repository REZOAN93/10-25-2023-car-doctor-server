const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.lh0lzsv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("CarDoctors");
    const ServiceCollection = database.collection("ServiceCollection");
    const productCollection = database.collection("productCollection");
    const bookingCollection = database.collection("bookingCollection");

    app.get("/services", async (req, res) => {
      const data = ServiceCollection.find();
      const dataCollection = await data.toArray();
      res.send(dataCollection);
    });

    app.get("/services/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: ids };
      const movie = await ServiceCollection.findOne(query);
      res.send(movie);
    });

    app.get("/products", async (req, res) => {
      const data = productCollection.find();
      const products = await data.toArray();
      res.send(products);
    });

    // using the query for filter the email wise data

    app.get("/booking", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const data = bookingCollection.find(query);
      const bookings = await data.toArray();
      res.send(bookings);
    });

    app.post("/booking", async (req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.send(result);
      console.log(result);
    });

    app.delete("/booking/:id", async (req, res) => {
      const ids = req.params.id;
      console.log(ids);
      const query = { _id: new ObjectId(ids) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      // const options = { data };
      const updateDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
