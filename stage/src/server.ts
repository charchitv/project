import 'dotenv/config';
import express, { Router } from 'express';
import * as mongoose from 'mongoose';
import { addItem, removeItem, listItems } from './controllers/myListController.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Body parser

// Database Connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not set. Check your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

const myListRouter: Router = express.Router();
// API Routes
myListRouter.post('/add', addItem); 
myListRouter.delete('/remove/:contentId', removeItem);
myListRouter.get('/', listItems);

app.use('/api/v1/my-list', myListRouter);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});