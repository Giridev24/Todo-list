const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// CORS options
const corsOptions = {
  origin: 'https://todo-client-nu.vercel.app',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true// Allow these methods
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas', err));


const SampleModel = require("./sample");

// Routes
app.get("/home", async (req, res) => {
  try {
   
    const todos = await SampleModel.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/home", async (req, res) => {
  try {
    const { todo } = req.body;
    const newTodo = await SampleModel.create({ todo });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/home/:id', async (req, res) => {
  const { id } = req.params;
  const { todo } = req.body;
  try {
    const updatedTodo = await SampleModel.findByIdAndUpdate(id, { todo }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/home/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SampleModel.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
