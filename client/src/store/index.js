// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../slices/todoSlice";

const store = configureStore({
  reducer: {
    todos: todoReducer, // Register todo slice
  },
});

export default store;
