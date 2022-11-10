const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();



const app = express();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qvrwoc0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('foodServices').collection('services');
        const reviewCollection = client.db('foodServices').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        app.post('/reviews', async (req, res) => {
            const reviewdata = req.body;
            const result = await reviewCollection.insertOne(reviewdata);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            console.log(req.query.email)
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(error => console.error(error))




app.get('/', (req, res) => {
    res.send('services review server is running')
});

app.listen(port, () => {
    console.log(`service review server running on ${port}`)
})