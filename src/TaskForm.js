import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc } from 'firebase/firestore';
import db from './firebase';
import { v4 as uuidv4 } from 'uuid';

const TaskForm = ({ addTask, editTask }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTask) {
      setId(editTask.id);
      setTitle(editTask.title);
      setDueDate(editTask.dueDate);
      setDescription(editTask.description);
    } else {
      setId(uuidv4());
      setTitle('');
      setDueDate('');
      setDescription('');
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '') {
      setError('Task title cannot be empty!');
      return;
    }

    if (dueDate === '') {
      setError('Due date must be selected');
      return;
    }

    const task = { id, title, dueDate, description };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), task);
      addTask(task);
      setId(uuidv4());
      setTitle('');
      setDueDate('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleSpeechToText = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onresult = function (event) {
      const speechToText = event.results[0][0].transcript;

      if (speechToText.includes('title')) {
        const extractedTitle = speechToText.split('title')[1].trim();
        setTitle(extractedTitle);
      }

      if (speechToText.includes('due date')) {
        const extractedDate = speechToText.split('due date')[1].trim();
        setDueDate(extractedDate);
      }

      if (speechToText.includes('description')) {
        const extractedDescription = speechToText.split('description')[1].trim();
        setDescription(extractedDescription);
      }
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="task-input-container">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <button type="button" onClick={handleSpeechToText} className="microphone-button">
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="todo-input"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="todo-input"
      />
      <button type="submit" className="todo-button">
        {editTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
