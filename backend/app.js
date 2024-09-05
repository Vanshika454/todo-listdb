const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const port = 3001;
app.use(express.json());
app.use(cors());
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

//routes
app.get("/todos", (req, res) => {
  const query = "SELECT * FROM Todo";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving todos:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

app.post("/todos/new", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO Todo (name) VALUES (?)";
  connection.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error creating todo:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const createdTodo = { id: result.insertId, name };
    res.status(201).json({ task: createdTodo });
  });
});

app.delete("/todos/delete/:id", (req, res) => {
  const todoId = req.params.id;
  const query = "DELETE FROM Todo WHERE id = ?";
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ id: todoId });
  });
});

app.listen(port, console.log(`server is running on port ${port}`));
