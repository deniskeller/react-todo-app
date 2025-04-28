import {  createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { Todo, NewTodo } from './types';

// const API_URL = 'http://localhost:3001/todos';
const API_URL = 'https://680a3fd11f1a52874cdfcbb4.mockapi.io/api/todos/todos';

type RejectedAction<T = unknown> = {
  payload?: T;
  error: SerializedError;
};

interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
	currentPage: number;
  itemsPerPage: number;
	draggedTodo: Todo | null;
}

interface ApiError {
  message: string;
  details?: string;
  code?: number;
  timestamp?: string;
}

// НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
	currentPage: 1,
  itemsPerPage: 5,
	draggedTodo: null,
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
// Функция для выведения ошибок
const handleRejectError = (state: TodosState, action: RejectedAction<ApiError>, message: string) => {
	if (action.payload) {
		state.error = action.payload.message;
	} else {
		state.error = action.error.message || message;
	}
}

// ПЕРВИЧНАЯ ЗАГРУЗКА ЗАДАЧ
export const loadTodos = createAsyncThunk<
Todo[],
void, 
{
	rejectValue: ApiError;
}
>('todos/loadTodos', async (_, { rejectWithValue }) => {
	try {
    const response = await fetch(API_URL);
		
    return await handleFetchError(response, 'Ошибка загрузки задач');
  } catch (error) {
    return rejectWithValue({
			message: 'Ошибка загрузки задач',
			details: (error as Error).message,
			timestamp: new Date().toISOString(),
			code: 500
		} as ApiError);
  }
});

// СОЗДАНИЕ НОВОЙ ЗАДАЧИ
export const createTodo = createAsyncThunk<
Todo,
NewTodo, 
{
	rejectValue: ApiError;
}
>(
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
			return rejectWithValue({
				message: 'Ошибка добавления задачи',
				details: (error as Error).message,
				timestamp: new Date().toISOString(),
				code: 500
			} as ApiError);
		}
  }
);

// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
export const updateTodo = createAsyncThunk<
Todo,
Todo, 
{
	rejectValue: ApiError;
}
>(
  'todos/updateTodo',
  async (todo: Todo, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/${todo.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(todo),
			});
			return handleFetchError(response, 'Ошибка редактирования задачи');
		} catch (error) {
			return rejectWithValue({
				message: 'Ошибка редактирования задачи',
				details: (error as Error).message,
				timestamp: new Date().toISOString(),
				code: 500
			} as ApiError);
		}
  }
);

// УДАЛЕНИЕ ЗАДАЧИ
export const deleteTodo = createAsyncThunk<
string,
string, 
{
	rejectValue: ApiError;
}
>(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/${id}`, {
				method: 'DELETE',
			});
			await handleFetchError(response, 'Ошибка удаления задачи');
			return id;
		} catch (error) {
			return rejectWithValue({
				message: 'Ошибка удаления задачи',
				details: (error as Error).message,
				timestamp: new Date().toISOString(),
				code: 500
			} as ApiError);
		}
  }
);
// УДАЛЕНИЕ ВСЕХ ВЫПОЛНЕННЫХ ЗАДАЧИ
export const deleteCompletedTodos = createAsyncThunk<
string[],
void,
{
	rejectValue: ApiError; // Тип для ошибок
}
>(
  'deleteCompletedTodos',
	async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { todos: TodosState };
      const completedTodos = state.todos.todos.filter(todo => todo.completed);

			if (completedTodos.length === 0) {
        return rejectWithValue({
          message: 'Нет выполненных задач для удаления',
          code: 404
        } as ApiError);
      }

      const deleteResults = await Promise.all(
        completedTodos.map(todo =>
          fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
              }
              return { success: true, id: todo.id, error: '' };
            })
            .catch(error => ({ 
              success: false, 
              id: todo.id, 
              error: error.message
            }))
        )
      );

      const failedDeletes = deleteResults.filter(r => !r.success);
      if (failedDeletes.length > 0) {
        throw new Error(
          `Не удалось удалить ${failedDeletes.length} задач: ` +
          failedDeletes.map(d => `ID ${d.id} (${d.error})`).join(', ')
        );
      }		

      return completedTodos.map(todo => todo.id); // Возвращаем ID удаленных задач
    } catch (error) {
      return rejectWithValue({
				message: 'Ошибка удаления выполненных задач',
				details: (error as Error).message,
				timestamp: new Date().toISOString(),
				code: 500
			} as ApiError);
    }
  }
);
// УДАЛЕНИЕ ВСЕХ ЗАДАЧИ
export const deleteAllTodos = createAsyncThunk<
void,
void,
{
	rejectValue: ApiError;
}
>(
  'todos/deleteAllTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const todos = await handleFetchError(response, 'Ошибка получения списка задач');

      if (todos.length === 0) {
        return rejectWithValue({
          message: 'Список задач уже пуст',
          code: 404,
        } as ApiError);
      }
			// сохраняем результат всех промисов
      const deleteResults = await Promise.all(
        todos.map((todo: Todo) =>
          fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
              }
              return { success: true, id: todo.id };
            })
            .catch(error => ({
              success: false,
              id: todo.id,
              error: error.message
            }))
        )
      );

      const failedDeletes = deleteResults.filter(r => !r.success); // фильтруем неудаленные задачи
			// если есть неудаленные задачи, то выкидываем ошибку
      if (failedDeletes.length > 0) {
        throw new Error(
          `Не удалось удалить ${failedDeletes.length} задач: ` +
          failedDeletes.map(d => `ID ${d.id} (${d.error})`).join(', ')
        );
      }
    } catch (error) {
      return rejectWithValue({
				message: 'Ошибка очищения списка задач',
				details: (error as Error).message,
				timestamp: new Date().toISOString(),
				code: 500
			} as ApiError);
    }
  }
);

// ОБНОВЛЕНИЕ пОРЯДКА ЗАДАЧИ
export const updateTodoOrder = createAsyncThunk<
  Todo,
  { id: string; order: number },
  { rejectValue: ApiError }
>(
  'todos/updateTodoOrder',
  async ({ id, order }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      return handleFetchError(response, 'Ошибка перемещения задачи');
    } catch (error) {
      return rejectWithValue({
        message: 'Ошибка перемещения задачи',
        details: (error as Error).message,
        timestamp: new Date().toISOString(),
        code: 500
      } as ApiError);
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
		setItemsPerPage: (state, action: PayloadAction<number>) => {		
      state.itemsPerPage = action.payload;
    },
		setDraggedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.draggedTodo = action.payload;
    },
		reorderTodos: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const newTodos = [...state.todos]; // Создаем копию массива todos
      const [removed] = newTodos.splice(dragIndex, 1); // Извлекаем перемещаемый элемент
      newTodos.splice(hoverIndex, 0, removed); // Вставляем его на новую позицию
      // Обновляем порядок задач
      newTodos.forEach((todo, index) => {
        todo.order = index + 1;
      });      
      state.todos = newTodos; // Сохраняем обновленный массив
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
				state.todos = action.payload.sort((a, b) => a.order - b.order); // Сортируем по ордеру
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = 'failed';
				handleRejectError(state, action, 'Ошибка загрузки задач')
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
				handleRejectError(state, action, 'Ошибка добавления задачи')
      })
			// ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
			.addCase(updateTodo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const index = state.todos.findIndex(t => t.id === action.payload.id);
				if (index !== -1) {
					state.todos[index] = action.payload;
				}
      })
			.addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
				handleRejectError(state, action, 'Ошибка обновления задачи')
      })
			// УДАЛЕНИЕ ЗАДАЧИ
			.addCase(deleteTodo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
				state.status = 'succeeded';
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
				computedPage(state)
      })
			.addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
				handleRejectError(state, action, 'Ошибка удаления задачи')
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
				handleRejectError(state, action, 'Ошибка удаления завершенных задач')
      })
			// УДАЛЕНИЕ ВСЕХ ЗАДАЧ
			.addCase(deleteAllTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAllTodos.fulfilled, (state) => {
        state.status = 'succeeded';
        state.todos = [];
      })
      .addCase(deleteAllTodos.rejected, (state, action) => {
        state.status = 'failed';
				handleRejectError(state, action, 'Ошибка очищения списка задач')
      })
			// ОБНОВЛЕНИЕ пОРЯДКА ЗАДАЧИ
			.addCase(updateTodoOrder.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.todos.sort((a, b) => a.order - b.order);
      });
  	},
});

export const { setCurrentPage, setItemsPerPage, reorderTodos, setDraggedTodo } = todosSlice.actions;
export default todosSlice.reducer;