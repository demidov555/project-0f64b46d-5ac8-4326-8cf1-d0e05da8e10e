import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App: React.FC = () => {
    const [tasks, setTasks] = React.useState([]);

    React.useEffect(() => {
        fetch('https://project-e506628f-8ee9-434a-9890.onrender.com/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);

    return (
        <div>
            <h1>Task Management</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));