import React, { useState } from "react";
import { Button } from "react-bootstrap";

const AddTodo = ({ onAdd }) => {
  const [nextId, setNextId] = useState(1);
  const [formData, setFormData] = useState({ todoName: "", date: "" });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addTodo = () => {
    if (formData.todoName && formData.date) {
      const newTodo = {
        id: nextId,
        todoName: formData.todoName,
        date: formatDate(formData.date), // Format the date here
      };
      setNextId((prev) => prev + 1);
      setFormData({ todoName: "", date: "" });

      // Call the onAdd prop to notify the parent component
      onAdd(newTodo);
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-6">
          <input
            type="text"
            placeholder="Enter Todo Here"
            className="form-control"
            onChange={changeHandler}
            name="todoName"
            value={formData.todoName}
            required
          />
        </div>
        <div className="col-4">
          <input
            type="date"
            className="form-control"
            onChange={changeHandler}
            name="date"
            value={formData.date}
            required
          />
        </div>
        <div className="col-2">
          <Button type="button" className="btn btn-success" onClick={addTodo}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddTodo;
