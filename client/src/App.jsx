import React, { useEffect, useState } from 'react';
import Todo from './Todo'; 

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [contentError, setContentError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const todos = await response.json();
        todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setTodos(todos);
      }
    }
    fetchTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.trim().length > 0 && dueDate.trim().length > 0) {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: content, dueDate })
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setContent("");
        setDueDate("");
        setContentError("");
        setDueDateError("");
      } else {
        const { error } = await res.json();
        setContentError(error);
      }
    } else {
      if (content.trim().length === 0) {
        setContentError("Todo cannot be empty");
      }
      if (dueDate.trim().length === 0) {
        setDueDateError("Due date is required");
      }
    }
  };

  return (
    <main className="container">
      <h1 className="title">Task Snap</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
        />
        <input 
          type="text"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Enter due date (YYYY-MM-DD)..."
          className="form__input"
        />
        <button type="submit" className="form__button">Create Todo</button>
      </form>
      <div className="todos">
{todos.map((todo) => (
          <Todo key={todo._id} todo={todo} setTodos={setTodos} />
        ))}
        {dueDateError && <div className="error">{dueDateError}</div>}
        {contentError && <div className="error">{contentError}</div>}
      </div>
    </main>
  );
}
