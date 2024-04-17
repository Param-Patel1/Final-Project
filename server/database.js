require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/todosdb";

// const options = {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// };

let client;
const connectToMongoDB = async () => {
    if (!client) {
        try {
            client = await MongoClient.connect(uri);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.log(error);
        }
    }
    return client;
};

const getConnectedClient = () => client;

module.exports = { connectToMongoDB, getConnectedClient };