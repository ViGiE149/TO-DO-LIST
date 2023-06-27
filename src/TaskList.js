import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const addTask = (task) => {
    if (editTask) {
      const updatedTasks = tasks.map((t) => (t.id === editTask.id ? task : t));
      setTasks(updatedTasks);
      setEditTask(null);
    } else {
      setTasks([...tasks, { ...task, id: Date.now() }]);
    }
  };

  const editTaskItem = (task) => {
    setEditTask(task);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>

      <TaskForm addTask={addTask} editTask={editTask} />

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} deleteTask={deleteTask} editTask={editTaskItem} />
      ))}
    </div>
  );
};

export default TaskList;