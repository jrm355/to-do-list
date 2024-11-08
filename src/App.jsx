import React, { useState, useEffect } from 'react';
import './app.css';
import DataEntryModal from './DataEntryModal';

function App() {
  // State for modal visibility, pre-filled tasks, form data, and editing ID
  const [showModal, setShowModal] = useState(true);
  const [todos, setTodos] = useState([]); // Initialize with empty array, updated with modal data
  const [formData, setFormData] = useState({ text: '' });
  const [currentlyEditingId, setCurrentlyEditingId] = useState(null);

  // Function to save tasks from the modal and close the modal
  const handleSaveTasks = (tasks) => {
    setTodos(tasks); // Set initial tasks from modal
    setShowModal(false);
  };

  useEffect(() => {
    // Show modal only on first render
    setShowModal(true);
  }, []);

  // Function to add a new task or save an edited task
  const addOrEditTodo = () => {
    if (formData.text.trim() === '') return;

    if (currentlyEditingId) {
      // Edit existing task
      setTodos(
        todos.map((todo) =>
          todo.id === currentlyEditingId ? { ...todo, text: formData.text } : todo
        )
      );
      setCurrentlyEditingId(null); // Clear editing state
    } else {
      // Add new task
      setTodos([
        ...todos,
        { text: formData.text, completed: false, id: Date.now(), priority: "today", type: "general" }
      ]);
    }

    setFormData({ text: '' }); // Clear form data
  };

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, text: e.target.value });
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete task if completed
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Edit task
  const editTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setFormData({ text: todoToEdit.text });
    setCurrentlyEditingId(id);
  };

  return (
    <div className="todo-app">
      {showModal && <DataEntryModal onClose={() => setShowModal(false)} onSave={handleSaveTasks} />}
      
      <h1>To-Do List</h1>

      {/* Input for new or edited task */}
      <input
        type="text"
        placeholder="Add a new task..."
        value={formData.text}
        onChange={handleChange}
      />
      
      <button onClick={addOrEditTodo}>
        {currentlyEditingId ? "Save Task" : "Add to to-do list"}
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="task-item">
            <span>{todo.text}</span>
            <span>Priority: {todo.priority}</span>
            <span>Type: {todo.type}</span>
            
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <label>Completed</label>

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