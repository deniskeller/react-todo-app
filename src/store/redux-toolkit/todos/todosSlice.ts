import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Todo, NewTodo } from './types';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './todosAPI';

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadTodos = createAsyncThunk('todos/loadTodos', async () => {
  return await fetchTodos();
});

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todo: NewTodo) => {
    return await addTodo(todo);
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    return await updateTodo(updatedTodo);
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id: number) => {
    await deleteTodo(id);
    return id;
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки задач';
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;