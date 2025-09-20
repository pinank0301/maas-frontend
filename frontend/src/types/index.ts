export interface Message {
  id: string
  content: string
  timestamp: Date
  isUser: boolean
}

export interface MockEndpoint {
  id: string
  method: string
  path: string
  response: any
  status: 'generating' | 'completed' | 'error'
}

export type Theme = 'light' | 'dark'
