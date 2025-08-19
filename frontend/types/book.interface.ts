export interface Book {
  id: string
  title: string
  author: string
  year: number | string
  coverBase64?: string   // url or base64
  review?: string
  rating?: number
}
