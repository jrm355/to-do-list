import React, { useState, useEffect } from 'react';
import './app.css';
import DataEntryModal from './DataEntryModal';

function App() {
  const [showModal, setShowModal] = useState(true);
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({ text: '', priority: 'today', type: 'general' });
  const [currentlyEditingId, setCurrentlyEditingId] = useState(null);

  const handleSaveTasks = (tasks) => {
    setTodos(tasks.map(task => ({ ...task, id: Date.now() + Math.random() })));
    setShowModal(false);
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  const addOrEditTodo = () => {
    if (formData.text.trim() === '') return;

    if (currentlyEditingId !== null) {
      setTodos(todos.map(todo =>
        todo.id === currentlyEditingId ? { ...todo, ...formData } : todo
      ));
      setCurrentlyEditingId(null);
    } else {
      setTodos([
        ...todos,
        { ...formData, completed: false, id: Date.now() }
      ]);
    }

    setFormData({ text: '', priority: 'today', type: 'general' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setFormData({ text: todoToEdit.text, priority: todoToEdit.priority, type: todoToEdit.type });
    setCurrentlyEditingId(id);
  };

  const sortTodos = (criteria) => {
    let sortedTodos = [...todos];
    if (criteria === 'priority') {
      const priorities = { today: 1, 'this week': 2, 'this month': 3 };
      sortedTodos.sort((a, b) => priorities[a.priority] - priorities[b.priority]);
    } else if (criteria === 'type') {
      sortedTodos.sort((a, b) => a.type.localeCompare(b.type));
    }
    setTodos(sortedTodos);
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