import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  toggleCompleteTodo,
} from "./slices/todoSlice";
import AddTodo from "./components/AddTodo";
import TodoItem from "./components/TodoItem";
import toast from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state);

  const [page, setPage] = useState(1);

  const handleNextPage = () => {
    if (page < todos.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleAddTodo = (newTodo) => {
    dispatch(addTodo(newTodo));
    toast.success("New Todo Item Added Successfully...!");
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
    toast.success("Todo Item Deleted Successfully...!");
  };

  const handleToggleComplete = (id, completed) => {
    dispatch(toggleCompleteTodo({ id, completed }));
  };

  // Fetch todos when the component mounts or when the page changes
  useEffect(() => {
    dispatch(fetchTodos({ page, limit: 7 }));
  }, [dispatch, page]); // Added 'page' as a dependency

  return (
    <div className="container">
      <h1 className="text-center my-5 text-info">Todo App</h1>
      <AddTodo onAdd={handleAddTodo} />
      {todos.loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TodoItem
            itemList={todos.items}
            onDelete={handleDeleteTodo}
            handleToggleComplete={handleToggleComplete}
          />
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between my-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="btn btn-primary"
            >
              Previous
            </button>
            <span>
              Page {page} of {todos.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === todos.totalPages}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>
        </>
      )}
      {todos.error && <p>Error: {todos.error}</p>}
    </div>
  );
}

export default App;
