import React, {
  Children,
  cloneElement,
  useCallback,
  useState,
  ReactNode,
  isValidElement,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Checkbox } from 'react-native-paper'

interface CheckboxGroupProps {
  children: ReactNode
  onChange?: (selectedItems: string[]) => void
}

export interface CheckboxItemProps {
  checked?: boolean
  onChange?: (id: string) => void
  checkboxItemId?: string // Use checkboxItemId to identify valid elements
}

export const Group: React.ForwardRefRenderFunction<
  { resetSelections: () => void },
  CheckboxGroupProps
> = ({ children, onChange }, ref) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const allItems = new Set<string>()

  useImperativeHandle(ref, () => ({
    resetSelections: () => {
      setSelectedItems([])
      onChange?.([])
    },
    selectAll: () => {
      setSelectedItems([...allItems])
      onChange?.([...allItems])
    },
    toggleSelectAll: () => {
      if (selectedItems.length < allItems.size) {
        setSelectedItems([...allItems])
        onChange?.([...allItems])
      } else {
        setSelectedItems([])
        onChange?.([])
      }
    },
  }))

  const handleCheckboxChange = useCallback(
    (id: string) => {
      const newSelection = selectedItems.includes(id)
        ? selectedItems.filter(itemId => itemId !== id)
        : [...selectedItems, id]

      setSelectedItems(newSelection)

      if (onChange) {
        onChange(newSelection)
      }
    },
    [selectedItems, onChange],
  )

  const enhancedChildren = Children.map(children, child => {
    if (isValidElement(child) && child.props.checkboxItemId) {
      allItems.add(child.props.checkboxItemId)
      return cloneElement(child, {
        checked: selectedItems.includes(child.props.checkboxItemId),
        onChange: handleCheckboxChange,
      })
    }
    return child
  })

  return <>{enhancedChildren}</>
}

export const CheckboxGroup = forwardRef(Group)

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  checked,
  onChange,
  checkboxItemId,
}) => {
  if (!checkboxItemId) {
    // If checkboxItemId is not provided, don't render anything
    return null
  }

  return (
    <Checkbox.Item
      status={checked ? 'checked' : 'unchecked'}
      onPress={() => onChange?.(checkboxItemId)}
      position="leading"
      label={``}
    />
  )
}
