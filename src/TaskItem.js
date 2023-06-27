import React, { useState, useEffect } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import alarmSound from './assets/alarm-sound.mp3';

const TaskItem = ({ task, deleteTask, editTask }) => {
  const [showDetails, setShowDetails] = useState(false); // State to control showing/hiding details
  const [reminderSet, setReminderSet] = useState(false); // State to track if a reminder is set
  const [alarmSet, setAlarmSet] = useState(false); // State to track if an alarm is set

  useEffect(() => {
    if (task.dueDate && task.time && !reminderSet) {
      const currentTime = new Date().getTime();
      const dueDateTime = new Date(`${task.dueDate} ${task.time}`).getTime();
      const timeDifference = dueDateTime - currentTime;

      if (timeDifference > 0) {
        // Schedule a reminder alert after the time difference
        const reminderTimeout = setTimeout(() => {
          alert(`Reminder: ${task.title}`);
          setReminderSet(true);
          deleteTask(task.id); // Remove the task from the list
        }, timeDifference);

        return () => clearTimeout(reminderTimeout);
      }
    }

    if (task.alarmTime && !alarmSet) {
      const currentTime = new Date().getTime();
      const alarmDateTime = new Date(`${task.dueDate} ${task.alarmTime}`).getTime();
      const timeDifference = alarmDateTime - currentTime;

      if (timeDifference > 0) {
        // Schedule an alarm alert after the time difference
        const alarmTimeout = setTimeout(() => {
          setAlarmSet(true);
        }, timeDifference);

        return () => clearTimeout(alarmTimeout);
      }
    }
  }, [task, reminderSet, alarmSet, deleteTask]);

  useEffect(() => {
    if (alarmSet) {
      playAlarmSound();
    }
  }, [alarmSet]);

  const handleEdit = () => {
    editTask(task);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails); // Toggle the state to show/hide details
  };

  const playAlarmSound = () => {
    const audio = new Audio(alarmSound);
    audio.play().catch(error => {
      // Handle the error if the audio playback fails
      console.error('Failed to play alarm sound:', error);
    });
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h3 className="task-title" onClick={handleToggleDetails}>
          {task.title}
        </h3>
        {showDetails && (
          <div>
            <p className="date">Due Date: {task.dueDate}</p>
            <p className="time">Time: {task.time}</p>
            <p className="alarm-time">Alarm Time: {task.alarmTime}</p>
            <textarea
              readOnly
              className="task-description"
              value={task.description}
            />
          </div>
        )}
      </div>
      <div className="icons">
        <button type="button" onClick={handleEdit} className="edit-icon" title="Edit Task">
          <AiFillEdit />
        </button>
        <button type="button" onClick={handleDelete} className="delete-icon" title="Delete Task">
          <AiFillDelete />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;