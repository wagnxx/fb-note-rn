// src/features/todos/TodoList.tsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { toggleTodo, removeTodo } from './todosSlice'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.items)
  const dispatch = useDispatch()

  const handleRemove = (id: number) => {
    dispatch(removeTodo(id))
  }

  return (
    <View>
      {todos.map(todo => (
        <View key={todo.id} style={styles.todoContainer}>
          <TouchableOpacity onPress={() => dispatch(toggleTodo(todo.id))}>
            <Text style={[styles.todo, todo.completed && styles.completed]}>
              {todo.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemove(todo.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  todo: {
    flex: 1,
    // padding: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
})

export default TodoList
