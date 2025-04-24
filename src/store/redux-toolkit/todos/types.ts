export interface Todo {
  id: string;
  title: string;
  completed: boolean;
	order: number;
	createdAt: string;
}

export type NewTodo = Omit<Todo, 'id'>;