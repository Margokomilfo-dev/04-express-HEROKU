import {MongoClient} from 'mongodb'
import {PostType} from './posts-repository'
import {BloggerType} from './bloggers-repository'

// const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const mongoUri = 'mongodb+srv://admin:admin@express.knv2b.mongodb.net/express?retryWrites=true&w=majority'
export const client = new MongoClient(mongoUri);
const connection = client.db("express")

export const posts = connection.collection<PostType>('posts')
export const bloggers = connection.collection<BloggerType>('bloggers')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("products").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
