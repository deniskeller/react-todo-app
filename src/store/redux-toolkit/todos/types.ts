export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;