export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;

export type SortType = 'none' | 'завершенные' | 'активные' | 'по алфивиту';