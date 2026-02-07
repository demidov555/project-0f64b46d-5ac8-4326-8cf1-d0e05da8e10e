import React from 'react';
import './index.css';

const App: React.FC = () => {
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    // Placeholder for API call to fetch tasks
  }, []);

  return (
    <div>
      <h1>Task Management</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;