// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodosState, Todo } from './types'

const initialState: TodosState = {
  items: [],
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now(),
        title: action.payload,
        completed: false,
      }
      state.items.push(newTodo)
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(td => td.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload)
    },
  },
})

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions
export default todosSlice.reducer
