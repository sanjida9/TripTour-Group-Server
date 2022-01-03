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

    // app.get("/watches", async (req, res) => {
    //   const allWatches = await watchesCollection.find({}).toArray();
    //   res.send(allWatches);
    // });

    app.get("/watches", async (req, res) => {
      const selected = req.query.filter;
      if (selected === "less7000") {
        const filter = { price: { $lt: 7000 } };
        const result = await watchesCollection.find(filter).toArray();
        res.send(result);
      } else if (selected === "more7000") {
        const filter = { price: { $gt: 7000 } };
        const result = await watchesCollection.find(filter).toArray();
        res.send(result);
      } else if (selected === "more10000") {
        const filter = { price: { $gt: 10000 } };
        const result = await watchesCollection.find(filter).toArray();
        res.send(result);
      } else if (selected === "less10000") {
        const filter = { price: { $lt: 10000 } };
        const result = await watchesCollection.find(filter).toArray();
        res.send(result);
      } else {
        const allWatches = await watchesCollection.find({}).toArray();
        res.send(allWatches);
      }
    });

    app.get("/hotels", async (req, res) => {
      const selected = req.query.filter;

      if (selected === "All") {
        const hotels = await hotelsCollection.find({}).toArray();
        res.send(hotels);
      } else if (selected) {
        const filter = { district: selected };
        const hotels = await hotelsCollection.find(filter).toArray();
        res.send(hotels);
      } else {
        const hotels = await hotelsCollection.find({}).toArray();
        res.send(hotels);
      }
    });

    app.post("/contactus", async (req, res) => {
      console.log(req.body);
      const result = await contactusCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    // car service

    app.post("/car", async (req, res) => {
      console.log(req.body);
      const result = await carCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });
    app.post("/bus", async (req, res) => {
      console.log(req.body);
      const result = await busCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });
    app.post("/flight", async (req, res) => {
      console.log(req.body);
      const result = await flightCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    app.get("/watch/:id", async (req, res) => {
      const watchID = req.params.id;
      const singleWatch = await watchesCollection
        .find({
          _id: ObjectId(watchID),
        })
        .toArray();

      res.send(singleWatch[0]);
    });
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

    app.post("/placeOrder", async (req, res) => {
      await orderCollection.insertOne(req.body);
      res.send();
    });

    app.get("/manageAllOrders", async (req, res) => {
      const allUserOrders = await orderCollection.find({}).toArray();

      res.send(allUserOrders);
    });

    app.post("/deleteOrder", async (req, res) => {
      const userID = await req.body.UserId;
      await orderCollection.deleteOne({ _id: ObjectId(userID) });

      res.json("Deleted!");
    });

    //bus ticket manage

    app.get("/manageBus", async (req, res) => {
      const allBusOrders = await busCollection.find({}).toArray();

      res.send(allBusOrders);
    });

    // flight manage
    app.get("/flight", async (req, res) => {
      const allFlightOrders = await flightCollection.find({}).toArray();

      res.send(allFlightOrders);
    });

    app.post("/deleteFlightOrder", async (req, res) => {
      const userID = await req.body.UserId;
      await flightCollection.deleteOne({ _id: ObjectId(userID) });

      res.json("Deleted!");
    });
    app.post("/updateFlightStatus", async (req, res) => {
      const status = await req.body.status;
      const id = await req.body.id;

      const filter = { _id: ObjectId(id) };
      await flightCollection.updateOne(filter, { $set: { status: status } });

      res.json("updated");
    });
    //
    app.post("/singleUserOrders", async (req, res) => {
      const userEmail = await req.body.userEmail;
      const singleUserBooking = await orderCollection
        .find({ userEmail: userEmail })
        .toArray();

      res.json(singleUserBooking);
    });

    app.post("/submitReview", async (req, res) => {
      await reviewCollection.insertOne(req.body);
      res.send();
    });

    app.get("/getReviews", async (req, res) => {
      const reviews = await reviewCollection.find({}).toArray();
      res.send(reviews);
    });

    app.post("/makeAdmin", async (req, res) => {
      const email = req.body.email;

      const filter = { userEmail: email };
      const options = { upsert: true };
      const updateRoles = {
        $set: {
          isAdmin: true,
        },
      };
      await userRolesCollection.updateOne(filter, updateRoles, options);

      res.send();
    });

    app.get("/isAdmin", async (req, res) => {
      const userEmail = req.query.userEmail;
      const result = await userRolesCollection
        .find({ userEmail: userEmail })
        .toArray();

      res.send(result[0]);
    });

    app.get("/getProducts", async (req, res) => {
      const products = await watchesCollection.find({}).toArray();

      res.send(products);
    });

    app.post("/updateStatus", async (req, res) => {
      const status = await req.body.status;
      const id = await req.body.id;

      const filter = { _id: ObjectId(id) };
      await orderCollection.updateOne(filter, { $set: { status: status } });

      res.json("updated");
    });

    // Delete Products
    app.post("/deleteProducts", async (req, res) => {
      const deleteReqId = await req.body.deleteReqId;
      await watchesCollection.deleteOne({ _id: ObjectId(deleteReqId) });

      res.send();
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
