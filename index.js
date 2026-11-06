import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import "dotenv/config"

const PORT = 5000;

const app= express();

app.use(cors("http://localhost:3000"));
app.use(express.json());




const client = new MongoClient(process.env.MONGO_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

const connectClient= await connectToMongoDB();
const db = connectClient.db("sport-nest");
const facilitiesCollection = db.collection("facilities");

app.post("/facilities", async(req, res)=>{
    const facilityData = req.body;
    const result = await facilitiesCollection.insertOne(facilityData);
    res.send(result)

})


app.get("/facilities", async(req, res)=>{
const result = await facilitiesCollection.find().toArray();
res.send(result)
})


app.get("/facilities/:id", async(req, res)=>{
  try {
    const id = req.params.id;
    const facility = await facilitiesCollection.findOne({ _id: new ObjectId(id) });
    res.send(facility);
  } catch (err) {
    res.status(400).send({ message: "Invalid facility id" });
  }
})

app.get('/', (req, res)=>{
    res.send("Hello Liton!");
})

app.get('/test', (req, res)=>{
    res.json({
        message: "Test Api"
    })
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})