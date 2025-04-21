import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, NewTodo } from './types';

const API_URL = 'http://localhost:3001/todos';

interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
	currentPage: number;
  itemsPerPage: number;
}

// НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
	currentPage: 1,
  itemsPerPage: 5,
};

// Функция для обработки ошибок
const handleFetchError = async (response: Response, message: string) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || message);
  }
  return response.json();
};
// Фукнция для определения страницы
const computedPage = (state: TodosState) => {
	// Если после удаления задач текущая страница пуста и это не первая страница, то переходим на страницу меньше
	const startIndex = (state.currentPage - 1) * state.itemsPerPage;
	if (state.todos.slice(startIndex, startIndex + state.itemsPerPage).length === 0 && state.currentPage > 1) {
		state.currentPage -= 1;
	}
}

// ПЕРВИЧНАЯ ЗАГРУЗКА ЗАДАЧ
export const loadTodos = createAsyncThunk('todos/loadTodos', async (_, { rejectWithValue }) => {
	try {
    const response = await fetch(API_URL);
    return await handleFetchError(response, 'Ошибка загрузки задач');
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// СОЗДАНИЕ НОВОЙ ЗАДАЧИ
export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todo: NewTodo, { rejectWithValue }) => {
		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(todo),
			});
			return handleFetchError(response, 'Ошибка добавления задачи');
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
  }
);

// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: Todo, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/${todo.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(todo),
			});
			return handleFetchError(response, 'Ошибка редактирования задачи');
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
  }
);

// УДАЛЕНИЕ ЗАДАЧИ
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/${id}`, {
				method: 'DELETE',
			});
			await handleFetchError(response, 'Ошибка удаления задачи');
			return id;
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
  }
);
// УДАЛЕНИЕ ВСЕХ ВЫПОЛНЕННЫХ ЗАДАЧИ
export const deleteCompletedTodos = createAsyncThunk(
  'deleteCompletedTodos',
	async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { todos: TodosState };
      const completedTodos = state.todos.todos.filter(todo => todo.completed);
      
      await Promise.all(
        completedTodos.map(todo => 
          fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' })
        )
      );      
      return completedTodos.map(todo => todo.id); // Возвращаем ID удаленных задач
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
		setCurrentPage: (state, action: PayloadAction<number>) => {		
      state.currentPage = action.payload;
    },
	},
  extraReducers: (builder) => {
    builder
			// ПЕРВИЧНАЯ ЗАГРУЗКА ЗАДАЧ
      .addCase(loadTodos.pending, (state) => {
        state.status = 'loading';
				state.error = null;
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
				
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string || 'Ошибка загрузки задач';		
      })
			// СОЗДАНИЕ НОВОЙ ЗАДАЧИ
			.addCase(createTodo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.todos.push(action.payload);
				const totalPages = Math.ceil(state.todos.length / state.itemsPerPage);
				if (state.currentPage < totalPages) {
					state.currentPage = totalPages;
				}
      })
			.addCase(createTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Ошибка добавления задачи';
      })
			// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
      .addCase(updateTodo.fulfilled, (state, action) => {
				const index = state.todos.findIndex(t => t.id === action.payload.id);
				if (index !== -1) {
					state.todos[index] = action.payload;
				}
      })
			// УДАЛЕНИЕ ЗАДАЧИ
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
				computedPage(state)
      })
			// УДАЛЕНИЕ ВСЕХ ВЫПОЛНЕННЫХ ЗАДАЧИ
			.addCase(deleteCompletedTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCompletedTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
				state.todos = state.todos.filter(todo => !action.payload.includes(todo.id)); // Удаляем задачи айди которых есть в возвращённом массиве
				computedPage(state)
      })
      .addCase(deleteCompletedTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Ошибка удаления выполненных задач';
      });
  },
});

export const { setCurrentPage } = todosSlice.actions;
export default todosSlice.reducer;