export const settings = {
    MONGO_URI: process.env.mongoURI || "mongodb+srv://admin:admin@express.knv2b.mongodb.net/express?retryWrites=true&w=majority",
    JWT_SECRET: process.env.JWT_SECRET || "123"
}
