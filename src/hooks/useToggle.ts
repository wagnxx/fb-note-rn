import { useState, useCallback } from 'react'

type ToggleFunction = (value?: boolean) => void

const useToggle = (initialState: boolean = false): [boolean, ToggleFunction] => {
  const [state, setState] = useState(initialState)

  const toggle: ToggleFunction = useCallback((value?: boolean) => {
    setState(prevState => (typeof value === 'boolean' ? value : !prevState))
  }, [])

  return [state, toggle]
}

export default useToggle
