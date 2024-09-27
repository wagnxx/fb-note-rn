import Tts from 'react-native-tts'

export const extractTextFromHTML = (html: string | undefined) => {
  if (!html) return null
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

export const text2Speak = (word: string, isAmerican = true) => {
  if (!word || word.length === 0) {
    return
  }
  Tts.setDefaultLanguage(isAmerican ? 'en-US' : 'en-GB')
  Tts.speak(word)
}
