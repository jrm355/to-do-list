import React, { useState } from 'react';

const DataEntryModal = ({ onClose, onSave }) => {
  const [tasks, setTasks] = useState([
    { text: "Check email", priority: "today", type: "work" },
    { text: "Walk the dogs", priority: "today", type: "animal" },
    { text: "Prepare dinner", priority: "today", type: "housework" },
    { text: "Put away laundry", priority: "this week", type: "housework" },
    { text: "Run laundry if needed", priority: "this week", type: "housework" },
    { text: "Load dishwasher", priority: "today", type: "housework" },
    { text: "Put away dishes", priority: "today", type: "housework" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  return (
    <div className="modal">
      <h2>Task Setup</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="text"
              value={task.text}
              onChange={(e) => handleChange(index, "text", e.target.value)}
            />
            <select
              value={task.priority}
              onChange={(e) => handleChange(index, "priority", e.target.value)}
            >
              <option value="today">Today</option>
              <option value="this week">This Week</option>
              <option value="this month">This Month</option>
            </select>
            <select
              value={task.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            >
              <option value="animal">Animal</option>
              <option value="baby">Baby</option>
              <option value="housework">Housework</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </li>
        ))}
      </ul>
      <button onClick={() => onSave(tasks)}>Save Tasks</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default DataEntryModal;