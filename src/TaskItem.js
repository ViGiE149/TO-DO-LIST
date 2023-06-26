// TaskItem.js
import React from 'react';
import { AiFillDelete } from 'react-icons/ai';

import { AiFillEdit } from 'react-icons/ai';

const TaskItem = ({ task, deleteTask, editTask }) => {
  const handleEdit = () => {
    editTask(task);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="date">Due Date: {task.dueDate}</p>
      </div>
      <div className="icons">
        <button type="button" onClick={handleEdit} className="edit-icon" title="edit Task" ><AiFillEdit/></button> 
         <button type="button" onClick={handleDelete} className="delete-icon" title="Delete Task"><AiFillDelete/></button> 
      </div>
    </div>
  );
};

export default TaskItem;
