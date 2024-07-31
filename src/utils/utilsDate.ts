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

/**
 * 格式化日期函数
 *
 * @param {Date} [date=new Date()] - 要格式化的日期对象，默认为当前日期。
 * @param {FormatOptions} [options=defaultOptions] - 格式化选项。
 * @param {string} [options.locale] - 本地化语言环境，默认为 'en-US'。
 * @param {'full' | 'long' | 'medium' | 'short'} [options.dateStyle] - 日期格式样式。
 * @param {'full' | 'long' | 'medium' | 'short'} [options.timeStyle] - 时间格式样式。
 * @param {string} [options.customFormat] - 自定义格式字符串，例如 'YYYY-MM-DD HH:mm:ss'。
 *
 * @returns {string} - 格式化后的日期字符串。
 *
 * @example
 * // 使用默认格式
 * const formattedDate1 = formatDate(new Date());
 * console.log(formattedDate1); // 输出示例： "Aug 1, 2024, 12:34:56 PM"
 *
 * @example
 * // 使用本地化格式
 * const formattedDate2 = formatDate(new Date(), {
 *   locale: 'fr-FR',
 *   dateStyle: 'full',
 *   timeStyle: 'short',
 * });
 * console.log(formattedDate2); // 输出示例： "jeudi 1 août 2024 à 12:34"
 *
 * @example
 * // 使用自定义格式
 * const formattedDate3 = formatDate(new Date(), {
 *   customFormat: 'YYYY-MM-DD HH:mm:ss',
 * });
 * console.log(formattedDate3); // 输出示例： "2024-08-01 12:34:56"
 */
export const formatDate = (
  date: Date = new Date(),
  options: FormatOptions = defaultOptions,
): string => {
  const { locale, dateStyle, timeStyle, customFormat } = options

  if (customFormat) {
    // 自定义格式实现
    return customFormat
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('DD', date.getDate().toString().padStart(2, '0'))
      .replace('HH', date.getHours().toString().padStart(2, '0'))
      .replace('mm', date.getMinutes().toString().padStart(2, '0'))
      .replace('ss', date.getSeconds().toString().padStart(2, '0'))
  }

  // 使用Intl.DateTimeFormat进行本地化格式化
  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
  }).format(date)
}

// 定义格式选项接口
interface FormatOptions {
  locale?: string
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
  customFormat?: string
}

// 默认格式选项
const defaultOptions: FormatOptions = {
  locale: 'en-US',
  dateStyle: 'medium',
  timeStyle: 'medium',
}
