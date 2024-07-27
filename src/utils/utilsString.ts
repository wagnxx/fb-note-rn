export const extractTextFromHTML = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}
