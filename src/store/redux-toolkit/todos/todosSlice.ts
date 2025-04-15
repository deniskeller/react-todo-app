import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, NewTodo, SortType } from './types';

const API_URL = 'http://localhost:3001/todos';

interface TodosState {
  todos: Todo[];
  status: 'initial' | 'loading' | 'succeeded' | 'failed';
  error: string | null; 
	sortType: SortType;
}

// НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: TodosState = {
  todos: [],
  status: 'initial',
  error: null, 
	sortType: 'none'
};

// Вспомогательная функция для обработки ошибок fetch
const handleFetchError = (response: Response, message: string) => {
  if (!response.ok) {
    throw new Error(message);
  }
  return response.json();
};

// ПЕРВИЧНАЯ ЗАГРУЗКА ЗАДАЧ
export const loadTodos = createAsyncThunk('todos/loadTodos', async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
	return handleFetchError(response, 'Ошибка загрузки задач');
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
		return handleFetchError(response, 'Ошибка добавления задачи');
  }
);

// УДАЛЕНИЕ ЗАДАЧИ
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number): Promise<number> => {
    const response = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		});
		await handleFetchError(response, 'Ошибка удаления задачи');
    return id;
  }
);

// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo): Promise<Todo> => {
    const response = await fetch(`${API_URL}/${todo.id}`, {
			method: 'PATCH',
      headers: {
				'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
				completed: !todo.completed
      }),
    });
		return handleFetchError(response, 'Ошибка редактирования задачи');
  }
);
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
		sortTodos(state, action: PayloadAction<SortType>) {
			return {
				...state,
				sortType: action.payload,
				todos: [...state.todos].sort((a, b) => {
					switch (action.payload) {
						case 'завершенные':
							return Number(b.completed) - Number(a.completed);
						case 'активные':
							return Number(a.completed) - Number(b.completed);
						case 'по алфивиту':
							return a.title.localeCompare(b.title);
						default:
							return 0;
					}
				})
			};
		},
		getCurrentTodo(state, action: PayloadAction<Exclude<Todo, 'id'>>) {
			console.log('action: ', action);

		}
	},
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
				const index = state.todos.findIndex(todo => todo.id === action.payload.id);
				if (index !== -1) {
					state.todos[index].completed = !state.todos[index].completed;
				}
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
  },
});

export const { sortTodos, getCurrentTodo } = todosSlice.actions;
export default todosSlice.reducer;