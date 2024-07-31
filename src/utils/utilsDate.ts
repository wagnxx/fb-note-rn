import type { Timestamp } from 'firebase/firestore'

export const transFBDate2Local = (date: Timestamp) => {
  try {
    const localDate = date.toDate()

    // 格式化日期（你可以根据需要调整格式）
    // 格式化日期和时间
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 使用 24 小时制
    }

    const result = localDate.toLocaleDateString('en-US', options)

    return result
  } catch (error) {
    return date || null
  }
}
