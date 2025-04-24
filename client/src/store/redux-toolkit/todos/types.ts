export interface Todo {
  id: string;
  title: string;
  completed: boolean;
	order: number;
}

export type NewTodo = Omit<Todo, 'id'>;