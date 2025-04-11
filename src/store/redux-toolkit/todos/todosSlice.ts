import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Todo, NewTodo } from './types';

const API_URL = 'http://localhost:3001/todos';

interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}


// НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
};

// ПЕРВИЧНАЯ ЗАГРУЗКА ЗАДАЧ
export const loadTodos = createAsyncThunk('todos/loadTodos', async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Ошибка загрузки задач');
  }
  return response.json();
});


// СОЗДАНИЕ НОВОЙ ЗАДАЧИ
export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todo: NewTodo): Promise<Todo> => {
    const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(todo),
		});
		if (!response.ok) {
			throw new Error('Ошибка добавления задачи');
		}
		return response.json();
  }
);


// ОБНОВЛЕНИ Е ЗАДАЧИ
export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo): Promise<Todo> => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(todo),
		});
		if (!response.ok) {
			throw new Error('Ошибка редактирования задачи');
		}
		return response.json();
  }
);


// УДАЛЕНИЕ ЗАДАЧИ
export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id: number): Promise<number> => {
		console.log('id: ', id);
    const response = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		});
		console.log('response: ', response);
		if (!response.ok) {
			throw new Error('Ошибка удаления задачи');
		}

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
        state.todos = action.payload;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки задач';
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;