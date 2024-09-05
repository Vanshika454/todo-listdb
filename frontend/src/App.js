import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
const API_BASE = "http://localhost:3001/todos";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("Get groceries");

  useEffect(() => {
    GetTodos();
  }, [items]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const GetTodos = () => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  };

  const addItem = async () => {
    console.log(input);
    const data = await fetch(API_BASE + "/new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: input,
        completed: false,
      }),
    }).then((res) => res.json());
    console.log(data);
    await GetTodos();
    setInput("");
  };

  const setItemsHandler = (id) => {
    const updateItem = items.filter((item) => String(item.id) !== String(id));
    console.log(updateItem, id);
    setItems(items);
  };

  return (
    <div className="container">
      <div className="heading">
        <h1>TO DO LIST APP</h1>
      </div>

      <div className="form">
        <button className="enterButton">
          <span>Enter the task: </span>
        </button>
        <input type="text" value={input} onChange={handleChange}></input>
        <button className="addButton" onClick={() => addItem()}>
          <span>Add Task</span>
        </button>
      </div>

      <div className="todolist">
        {items.map((item) => {
          const { id, name, completed } = item;
          return (
            <TodoItem
              name={name}
              id={id}
              completed={completed}
              setItems={setItemsHandler}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
