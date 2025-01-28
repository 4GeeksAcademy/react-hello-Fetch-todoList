import React, { useState, useEffect } from 'react';


const TodoList = () => {

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const USER_NAME = 'MafeG';
  const API_BASE_URL = 'https://playground.4geeks.com/todo';
  const createUser = async () => {
    try {
      await fetch(`${API_BASE_URL}/users/${USER_NAME}`, { method: 'POST' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  const loadTasks = async () => {
    try {
      await createUser();
      const response = await fetch(`${API_BASE_URL}/todos/${USER_NAME}`);
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const createTask = async (taskLabel) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${USER_NAME}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: taskLabel, is_done: false }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTask('');
    } catch (error) {
      setError(error.message);
    }
  };
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: !currentStatus }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);
  if (isLoading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && newTask.trim() && createTask(newTask.trim())}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-2">
        {tasks.length === 0 ? (
          <li className="text-gray-500">No tasks, add some tasks</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2 p-2 border rounded">
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => toggleTaskCompletion(task.id, task.is_done)}
                className="h-4 w-4"
              />
              <span className={task.is_done ? 'line-through flex-1' : 'flex-1'}>
                {task.label}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="mt-4 text-gray-600">
        {tasks.length} item{tasks.length !== 1 ? 's' : ''} left
      </div>
    </div>
  );
};
export default TodoList;