import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, NewTodo, SortType } from './types';

const API_URL = 'http://localhost:3001/todos';

interface TodosState {
  todos: Todo[];
  status: 'initial' | 'loading' | 'succeeded' | 'failed';
  error: string | null; 
	sortType: SortType;
	currentPage: number;
  itemsPerPage: number;
}

// НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: TodosState = {
  todos: [],
  status: 'initial',
  error: null, 
	sortType: 'none',
	currentPage: 1,
  itemsPerPage: 5,
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
  async (id: string): Promise<string> => {
    const response = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		});
		await handleFetchError(response, 'Ошибка удаления задачи');
    return id;
  }
);

// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: Todo): Promise<Todo> => {
    const response = await fetch(`${API_URL}/${todo.id}`, {
			method: 'PATCH',
      headers: {
				'Content-Type': 'application/json',
      },
			body: JSON.stringify(todo),
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
		setCurrentPage: (state, action: PayloadAction<number>) => {		
      state.currentPage = action.payload;
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

				const totalPages = Math.ceil(state.todos.length / state.itemsPerPage);
				if (state.currentPage < totalPages) {
					state.currentPage = totalPages;
				}
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
				const index = state.todos.findIndex(t => t.id === action.payload.id);
				if (index !== -1) {
					state.todos[index] = action.payload;
				}
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
				// Если после удаления текущая страница пуста и это не первая страница, то переходим на страницу меньше
				const startIndex = (state.currentPage - 1) * state.itemsPerPage;
				if (state.todos.slice(startIndex, startIndex + state.itemsPerPage).length === 0 && state.currentPage > 1) {
					state.currentPage -= 1;
				}
      })
  },
});

export const { sortTodos, setCurrentPage } = todosSlice.actions;
export default todosSlice.reducer;