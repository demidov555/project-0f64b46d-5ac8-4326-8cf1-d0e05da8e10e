import React, { useEffect, useState, FormEvent } from 'react';
import './index.css';
import { API_BASE } from './constants';

// GET /tasks
// POST /tasks
// DELETE /tasks/{id}
// PUT /tasks/{id}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.status}`);
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      if (!res.ok) {
        throw new Error(`Failed to add task: ${res.status}`);
      }
      const created: Task = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTitle('');
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
      });
      if (!res.ok) {
        throw new Error(`Failed to update task: ${res.status}`);
      }
      const updated: Task = await res.json();
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error(`Failed to delete task: ${res.status}`);
      }
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="tasks">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              {task.title}
            </label>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
