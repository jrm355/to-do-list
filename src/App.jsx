import React, { useState, useEffect, useReducer } from 'react';
import './app.css';
import DataEntryModal from './DataEntryModal';

const initialState = [];

function todosReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload.map(task => ({ ...task, id: Date.now() + Math.random() }));
    case 'ADD_TODO':
      return [{ ...action.payload, completed: false, id: Date.now() }, ...state];
    case 'EDIT_TODO':
      return state.map(todo =>
        todo.id === action.payload.id ? { ...todo, ...action.payload.data } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'TOGGLE_COMPLETE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'SORT_PRIORITY':
      return [...state].sort((a, b) => {
        const priorities = { today: 1, 'this week': 2, 'this month': 3 };
        return priorities[a.priority] - priorities[b.priority];
      });
    case 'SORT_TYPE':
      return [...state].sort((a, b) => a.type.localeCompare(b.type));
    default:
      return state;
  }
}

function App() {
  const [showModal, setShowModal] = useState(true);
  const [todos, dispatch] = useReducer(todosReducer, initialState);
  const [formData, setFormData] = useState({ text: '', priority: 'today', type: 'general' });
  const [currentlyEditingId, setCurrentlyEditingId] = useState(null);

  const handleSaveTasks = (tasks) => {
    dispatch({ type: 'SET_TASKS', payload: tasks });
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  const addOrEditTodo = () => {
    if (formData.text.trim() === '') return;

    if (currentlyEditingId !== null) {
      dispatch({
        type: 'EDIT_TODO',
        payload: { id: currentlyEditingId, data: formData }
      });
      setCurrentlyEditingId(null);
    } else {
      dispatch({ type: 'ADD_TODO', payload: formData });
    }

    setFormData({ text: '', priority: 'today', type: 'general' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleComplete = (id) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const editTodo = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setFormData({ text: todoToEdit.text, priority: todoToEdit.priority, type: todoToEdit.type });
    setCurrentlyEditingId(id);
  };

  const sortTodos = (criteria) => {
    if (criteria === 'priority') {
      dispatch({ type: 'SORT_PRIORITY' });
    } else if (criteria === 'type') {
      dispatch({ type: 'SORT_TYPE' });
    }
  };

  return (
    <div className="todo-app">
      {showModal && <DataEntryModal onClose={() => setShowModal(false)} onSave={handleSaveTasks} />}

      <h1>To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Add or edit a task..."
          name="text"
          value={formData.text}
          onChange={handleChange}
        />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="today">Today</option>
          <option value="this week">This Week</option>
          <option value="this month">This Month</option>
        </select>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="general">General</option>
          <option value="animal">Animal</option>
          <option value="baby">Baby</option>
          <option value="housework">Housework</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <button onClick={addOrEditTodo}>
          {currentlyEditingId ? "Save Task" : "Add Task"}
        </button>
      </div>

      <div className="sort-section">
        <button onClick={() => sortTodos('priority')}>Sort by Priority</button>
        <button onClick={() => sortTodos('type')}>Sort by Type</button>
      </div>

      <div className="list-header">
        <div className="header-task">Task</div>
        <div className="header-urgency">Urgency</div>
        <div className="header-type">Type</div>
        <div className="header-completed">Completed</div>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="task-item">
            <span>{todo.text}</span>
            <span>{todo.priority}</span>
            <span>{todo.type}</span>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <button onClick={() => editTodo(todo.id)}>Edit</button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className={todo.completed ? '' : 'disabled-button'}
              disabled={!todo.completed}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;