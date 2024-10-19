import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/todos";

// Helper function to check response status
const checkResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Helper function for common headers
const jsonHeaders = {
  "Content-Type": "application/json",
};

// Async thunk to fetch todos with pagination
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ page = 1, limit = 10 }) => {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
    return await checkResponse(response);
  }
);

// Async thunk to add a new todo
export const addTodo = createAsyncThunk("todos/addTodo", async (todo) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(todo),
  });
  return await checkResponse(response);
});

// Async thunk to delete a todo
export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await checkResponse(response); // No need to return anything for deletion
  return id; // Return the ID to remove it from the state
});

// Async thunk to toggle completion status of a todo
export const toggleCompleteTodo = createAsyncThunk(
  "todos/toggleCompleteTodo",
  async ({ id, completed }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({ completed, date: new Date().toLocaleString() }),
    });
    return await checkResponse(response); // Return the updated todo
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalPages: 0, // For pagination
    currentPage: 1,
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.todos; // Adjust according to your API response structure
        state.totalPages = action.payload.totalPages; // Adjust according to your API response structure
        state.currentPage = action.payload.currentPage; // Adjust according to your API response structure
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Todo
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Adjust according to your API response structure
        state.error = null; // Clear any previous errors
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo._id !== action.payload);
        state.error = null; // Clear any previous errors
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Toggle Complete Todo
      .addCase(toggleCompleteTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload; // The full updated todo object
        const index = state.items.findIndex(
          (todo) => todo._id === updatedTodo._id
        );

        if (index !== -1) {
          state.items[index] = updatedTodo; // Update the todo in state
        }
        state.error = null; // Clear any previous errors
      })
      .addCase(toggleCompleteTodo.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
