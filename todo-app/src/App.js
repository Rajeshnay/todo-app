import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // GET tasks
  const fetchTasks = () => {
    fetch("http://localhost:5000/get")
      .then(res => res.json())
      .then(data => setTasks(data.filter(t => t !== null))); // remove null
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD task
  const addTask = () => {
    if (task.trim() === "") return;

    fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: task })
    }).then(() => {
      setTask("");
      fetchTasks();
    });
  };

  // DELETE task
  const deleteTask = (index) => {
    fetch(`http://localhost:5000/delete/${index}`, {
      method: "DELETE"
    }).then(() => fetchTasks());
  };

  // TOGGLE COMPLETE
  const toggleComplete = (index) => {
    const updated = tasks[index];

    fetch(`http://localhost:5000/update/${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...updated,
        completed: !updated.completed
      })
    }).then(() => fetchTasks());
  };

  // START EDIT
  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  // SAVE EDIT
  const saveEdit = () => {
    fetch(`http://localhost:5000/update/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...tasks[editIndex],
        text: editText
      })
    }).then(() => {
      setEditIndex(null);
      fetchTasks();
    });
  };

  return (
    <div className="container">
      <h1>✨ Full Stack To-Do</h1>

      <div className="input-section">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>➕ Add</button>
      </div>

      <ul>
        {tasks.map((t, index) =>
          t ? (
            <li key={index} className={t.completed ? "completed" : ""}>
              
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(index)}
              />

              {editIndex === index ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={saveEdit}>💾</button>
                </>
              ) : (
                <>
                  <span>{t.text}</span>
                  <button onClick={() => startEdit(index)}>✏️</button>
                </>
              )}

              <button onClick={() => deleteTask(index)}>❌</button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

export default App;