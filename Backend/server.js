// Importing Libraries
import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from './routes/chat.js';

// App and Port
const app = express();
const PORT = 8080;


// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/api", chatRoutes);


// Connecting Mongodb
const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with database");
    } catch(err){
        console.log(`Failed to connect - ${err}`);
    }
}


// Main Running App
const startServer = async() => {
    await connectDb();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

startServer();