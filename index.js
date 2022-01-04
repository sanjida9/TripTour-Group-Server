const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kryx3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("watchfulWrist");
    const watchesCollection = database.collection("watches");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userRolesCollection = database.collection("userRoles");
    const hotelsCollection = database.collection("hotels");
    const contactusCollection = database.collection("contact");
    const carCollection = database.collection("car");
    const busCollection = database.collection("bus");
    const flightCollection = database.collection("flight");

    app.get("/hotel/:id", async (req, res) => {
      const watchID = req.params.id;
      const singleHotel = await hotelsCollection
        .find({
          _id: ObjectId(watchID),
        })
        .toArray();

      res.send(singleHotel[0]);
    });

    app.post("/newWatch", async (req, res) => {
      const newWatchData = await req.body;
      await watchesCollection.insertOne(newWatchData);

      res.send(newWatchData);
    });
    app.post("/newHotel", async (req, res) => {
      const newHotelData = await req.body;
      await hotelsCollection.insertOne(newHotelData);

      res.send(newHotelData);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

console.log(uri);

app.get("/", (req, res) => {
  res.send("Hello Watching!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
