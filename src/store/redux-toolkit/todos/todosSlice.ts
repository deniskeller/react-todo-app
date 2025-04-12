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


// ОБНОВЛЕНИЕ ЗАДАЧИ
export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo): Promise<Todo> => {
    const updatedTodo = { ...todo, completed: !todo.completed };
		console.log('updatedTodo: ', updatedTodo);

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
    const response = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error('Ошибка удаления задачи');
		}

    return id;
  }
);

export const sortingTodos = () => {

}

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
						case 'completed':
							return Number(b.completed) - Number(a.completed);
						case 'active':
							return Number(a.completed) - Number(b.completed);
						case 'alphabet':
							return a.title.localeCompare(b.title);
						default:
							return 0;
					}
				})
			};
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
				state.todos = state.todos.map((todo) => {
          if (todo.id !== action.payload.id) {
            return todo;
          } else {
            return { ...todo, completed: !action.payload.completed };
          }
        })
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
  },
});

export const { sortTodos } = todosSlice.actions;
export default todosSlice.reducer;