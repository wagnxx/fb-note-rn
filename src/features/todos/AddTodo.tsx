// src/features/todos/AddTodo.tsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from './todosSlice'
import { Button, TextInput, View, StyleSheet } from 'react-native'

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = () => {
    if (title.trim()) {
      dispatch(addTodo(title))
      setTitle('')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="New todo"
      />
      <Button title="Add Todo" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
  },
})

export default AddTodo
