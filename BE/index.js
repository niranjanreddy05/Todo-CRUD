const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todo")
  .then(() => {
    console.log("connected to db")
  })
  .catch((e) => {
    console.log(e)
  })

const todoSchema = new mongoose.Schema({
  task: String
});

const Task = mongoose.model('tasks', todoSchema);

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get('/tasks', async (req, res) => {
  const data = await Task.find();
  res.status(200).json(data);
})

app.post('/tasks', async (req, res) => {
  const task = req.body;
  await Task.create(task);
  const data = await Task.find();
  res.status(200).json(data);
})

app.put('/tasks/:id', async (req, res) => {
  const task = req.body;
  const { id } = req.params;
  await Task.findByIdAndUpdate(id, task);
  const data = await Task.find();
  res.status(200).json(data);
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  const data = await Task.find();
  res.status(200).json(data);
})

app.listen(3000, console.log('listening at port 3000'))