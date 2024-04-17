import React from 'react';

const Todo = ({ todo, setTodos }) => {
  // Calculate the difference in days between current date and due date
  const currentDate = new Date();
  const dueDate = new Date(todo.dueDate);
  const diffInDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

  // Style for past due dates
  const todoStyle = {
    backgroundColor: diffInDays < 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    border: diffInDays < 0 ? '2px solid red' : '2px solid transparent'
  };

  const updateTodo = async (todoId, todoStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: todoStatus }),
        headers: {
          "Content-Type": "application/json"
        },
      });
      const json = await res.json();
      if (json.acknowledged) {
        setTodos(currentTodos => {
          return currentTodos.map((currentTodo) => {
            if (currentTodo._id === todoId) {
              return { ...currentTodo, status: !currentTodo.status };
            }
            return currentTodo;
          });
        });
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.acknowledged) {
        setTodos(currentTodos => {
          return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
        });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo" style={todoStyle}>
      <p className="todo__content">{todo.todo}</p>
      <p className="todo__due-date">Due Date: {todo.dueDate}</p>
      <p className="todo__diff-days">Days Left: {diffInDays}</p>
      <div className="mutations">
        <button
          className={`todo__status ${todo.status ? 'completed' : 'pending'}`}
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "Completed" : "Pending"}
        </button>
        <button
          className="todo__delete"
          onClick={() => deleteTodo(todo._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Todo;
