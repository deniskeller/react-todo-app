import { Todo, NewTodo } from "./types";

const API_URL = 'http://localhost:3001/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Ошибка загрузки задач');
  }
  return response.json();
};

export const addTodo = async (todo: Todo): Promise<Todo> => {
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
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${todo.id}`, {
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
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
  });
	console.log('response: ', response);
  if (!response.ok) {
    throw new Error('Ошибка удаления задачи');
  }
};