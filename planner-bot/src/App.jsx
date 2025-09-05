import { useState, useEffect, useMemo, useRef } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueAt, setDueAt] = useState("");

  const [filter, setFilter] = useState("all");
  const textRef = useRef(null);



  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const remaining = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);

  const goals = [...new Set(tasks.map(t => t.goal))];



   const addTask = () => {
    
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, goal: goalInput || "General", done: false, priority, createdAt: new Date().toISOString(), dueAt: dueAt || undefined},
    ]);
    setInput("");
    setText("");
    setGoalInput("");
    setPriority("low");
    setDueAt("");


    requestAnimationFrame(() => textRef.current?.focus());

  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };



  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };


  const isOverdue = (task) => {
    if (!task.dueAt || task.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueAt);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const badgeStyle = (p) => {
    if (p === "high") return { background: "#fee2e2", color: "#991b1b", padding: "2px 6px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 };
    if (p === "med")  return { background: "#fef9c3", color: "#854d0e",  padding: "2px 6px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 };
    return { background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 };
  };

  const pillBtn = (active) => ({
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: active ? "#111827" : "#fff",
    color: active ? "#fff" : "#111827",
    cursor: "pointer",

     });

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>Progress Tracker</h1>
        <span style={{ background: "#21ebd4ff", borderRadius: 999, padding: "6px 12px", fontSize: 14 }}>
          {remaining} left
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "active", "completed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={pillBtn(filter === f)}
            aria-label={`Filter ${f}`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>


      <div className="input-section" style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        
        <input
          ref={textRef}
          placeholder="New task... (Enter to add, Shift+Enter for newline)"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          value={goalInput}
          placeholder="Goal (optional)"
          onChange={(e) => setGoalInput(e.target.value)}
        />

        <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Due date (optional)</label>
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}></div>
        
         <button onClick={addTask}>Add</button>
      </div>

      {goals.map(goal => {

        
        const goalTasks = tasks.filter(t => t.goal === goal);
        const doneCount = goalTasks.filter(t => t.done).length;
        const progress = goalTasks.length === 0 ? 0 : (doneCount / goalTasks.length) * 100;


        const visibleTasks = goalTasks.filter((t) => {
          if (filter === "active") return !t.done;
          if (filter === "completed") return t.done;
          return true; // all
        });


        

        return (
          <div key={goal} className="goal-section">
            <h2>{goal} ({doneCount}/{goalTasks.length})</h2>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%`}}
              ></div>
            </div>

            {visibleTasks.length === 0 && (
              <div style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>
                No tasks here — try a different filter or add one above.
              </div>
            )}

            {visibleTasks.map(task => (
              <div key={task.id} className="task">
                <span
                  className={task.done ? "done" : ""}
                  onClick={() => toggleDone(task.id)}
                >

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {/* Priority badge */}
                    <span style={badgeStyle(task.priority || "low")}>
                      {task.priority === "med" ? "Medium" : (task.priority || "low").replace(/^./, c => c.toUpperCase())}
                    </span>

                  {task.dueAt && (
                      <span style={{ fontSize: 12, color: isOverdue(task) ? "#dc2626" : "#6b7280" }}>
                        Due {new Date(task.dueAt).toLocaleDateString()}
                        {isOverdue(task) && <strong style={{ marginLeft: 6, color: "#dc2626" }}>• Overdue</strong>}
                      </span>
                    )}


                  </div>


                  {task.text}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => toggleDone(task.id)}
                  disabled={task.done}
                  title={task.done ? "Already done" : "Mark as done"}
                >
                  {task.done ? "Done ✓" : "Mark done"}
                </button>

  <button onClick={() => deleteTask(task.id)}>Delete</button>
</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default App;