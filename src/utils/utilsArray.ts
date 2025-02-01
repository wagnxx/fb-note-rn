export const hasCommonElements = (
  arr1: string[],
  arr2: string[],
  minCommonElements: number = 2,
): boolean => {
  // 如果数组为空，返回 false
  if (arr1.length === 0 || arr2.length === 0) {
    return false
  }

  // 如果其中一个数组只有一个元素，直接在另一个数组中查找该元素
  if (arr1.length === 1 || arr2.length === 1) {
    return arr1.some(item => arr2.includes(item)) || arr2.some(item => arr1.includes(item))
  }

  // 正则匹配，去除元素中的括号及其内容
  const normalize = (str: string): string => {
    return str.replace(/\(.*\)/g, '')
  }

  // 对两个数组中的元素进行归一化处理
  const normalizedArr1 = arr1.map(normalize)
  const normalizedArr2 = arr2.map(normalize)

  // 计算交集数量
  const commonElements = normalizedArr1.filter(item => normalizedArr2.includes(item))

  // 如果交集的数量大于等于指定的最小数量，返回 true，否则返回 false
  return commonElements.length >= minCommonElements
}
