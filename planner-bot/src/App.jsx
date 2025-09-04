import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, goal: goalInput || "General", done: false },
    ]);
    setInput("");
    setGoalInput("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const goals = [...new Set(tasks.map(t => t.goal))];

  return (
    <div className="container">
      <h1>Planner Bot</h1>

      <div className="input-section">
        <input
          placeholder="Goal (optional)"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
        />
        <input
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {goals.map(goal => {
        const goalTasks = tasks.filter(t => t.goal === goal);
        const doneCount = goalTasks.filter(t => t.done).length;
        const progress = goalTasks.length === 0 ? 0 : (doneCount / goalTasks.length) * 100;

        return (
          <div key={goal} className="goal-section">
            <h2>{goal} ({doneCount}/{goalTasks.length})</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {goalTasks.map(task => (
              <div key={task.id} className="task">
                <span
                  className={task.done ? "done" : ""}
                  onClick={() => toggleDone(task.id)}
                >
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default App;







{/*

import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, goal: goalInput || "General", done: false },
    ]);
    setInput("");
    setGoalInput("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const goals = [...new Set(tasks.map(t => t.goal))];

  return (
    <div className="container">
      <h1>Planner Bot</h1>

      <div className="input-section">
        <input
          placeholder="Goal (optional)"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
        />
        <input
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {goals.map(goal => {
        const goalTasks = tasks.filter(t => t.goal === goal);
        const doneCount = goalTasks.filter(t => t.done).length;
        const progress = goalTasks.length === 0 ? 0 : (doneCount / goalTasks.length) * 100;

        return (
          <div key={goal} className="goal-section">
            <h2>{goal} ({doneCount}/{goalTasks.length})</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {goalTasks.map(task => (
              <div key={task.id} className="task">
                <span
                  style={{ textDecoration: task.done ? "line-through" : "none", color: task.done ? "#888" : "#333" }}
                  onClick={() => toggleDone(task.id)}
                >
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default App;
*/}
