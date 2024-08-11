// src/features/todos/types.ts

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface TodosState {
  items: Todo[]
}
