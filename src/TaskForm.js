import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import db from './firebase';

const TaskForm = ({ addTask, editTask }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [userTasks, setUserTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editTask) {
      setId(editTask.id);
      setTitle(editTask.title);
      setDueDate(editTask.dueDate);
      setTime(editTask.time);
      setDescription(editTask.description);
    } else {
      setId(uuidv4());
      setTitle('');
      setDueDate('');
      setTime('');
      setDescription('');
    }
  }, [editTask]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const fetchUserTasks = async () => {
      try {
        const q = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const tasks = [];
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          tasks.push(task);
        });

        setUserTasks(tasks);
      } catch (error) {
        console.error('Error retrieving user tasks: ', error);
      }
    };

    setUser(currentUser);

    if (currentUser) {
      fetchUserTasks();
    } else {
      setUserTasks([]); // Clear tasks when user is logged out
    }
  }, [user]);

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

    if (time === '') {
      setError('Time must be selected');
      return;
    }

    const task = { id, title, dueDate, time, description };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), task);
      const addedTask = { ...task, id: docRef.id };
      addTask(addedTask);
      setId(uuidv4());
      setTitle('');
      setDueDate('');
      setTime('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      setError(error.message);
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

      if (speechToText.includes('time')) {
        const extractedTime = speechToText.split('time')[1].trim();
        setTime(extractedTime);
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
      <div className="datetime-container">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-input"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="todo-input"
        />
      </div>
      <button type="submit" className="todo-button">
        {editTask ? 'Update Task' : 'Add Task'}
      </button>
      <br />
      <button className="todo-button" onClick={handleLogout}>
        Logout
      </button>
      {error && <p>{error}</p>}
      {userTasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </form>
  );
};

export default TaskForm;
