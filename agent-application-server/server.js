// require in dependencies
const cors = require('cors');
const express = require('express');

const MongoClient = require('mongodb').MongoClient;

const config = require('./config.json');

const search = require('./search');
const history = require('./history');

// call the express function which provides features and functionality for our server
const app = express();
const port = 8888;

// apply middleware to application level
app.use(cors());
app.use(express.json());

// add the search router using the prefix /search
app.use('/search', search);

// add the history router using the prefix /history
app.use('/history', history);

// mongodb+srv://dbAdmin:<password>@cluster0.asnx5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const url = `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.db_name}`;
// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect((err) => {
    if (err) {
        throw new Error('Failed to connect to MongoDb');
    }

    console.log('Connected successfully to Mongo');

    app.locals.db = client.db();

    // start the server
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});