const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let data = [];

// CREATE
app.post("/add", (req, res) => {
  const task = {
    text: req.body.text,
    completed: false
  };

  data.push(task);
  res.status(201).send("Task added");
});

// READ
app.get("/get", (req, res) => {
  res.json(data);
});

// UPDATE
app.put("/update/:index", (req, res) => {
  const index = req.params.index;

  if (data[index]) {
    data[index] = req.body;
    res.send("Task updated");
  } else {
    res.status(404).send("Task not found");
  }
});

// DELETE
app.delete("/delete/:index", (req, res) => {
  const index = req.params.index;

  if (data[index]) {
    data.splice(index, 1); //  no null issue
    res.send("Task deleted");
  } else {
    res.status(404).send("Task not found");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});