import React, { useEffect, useState } from 'react';
import './index.css';

// API operations referenced for acceptance checks
// GET /tasks
// POST /tasks
// DELETE /tasks/{id}
// PUT /tasks/{id}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const API_BASE = 'https://project-e506628f-8ee9-434a-9890.onrender.com';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET /tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // POST /tasks
  const addTask = async (title: string) => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const task: Task = await res.json();
      setTasks((prev) => [...prev, task]);
      setNewTitle('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // PUT /tasks/{id}
  const toggleTask = async (task: Task) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // DELETE /tasks/{id}
  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div className="add-task">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={() => addTask(newTitle)}>Add</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              {task.title}
            </label>
            <button onClick={() => deleteTask(task.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
