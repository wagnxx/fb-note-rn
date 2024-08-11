export const extractTextFromHTML = (html: string | undefined) => {
  if (!html) return null
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}
