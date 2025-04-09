export interface Todo {
	text: any;
  id: number;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;