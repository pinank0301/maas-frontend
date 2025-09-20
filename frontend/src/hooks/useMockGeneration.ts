import { useState } from 'react'
import { MockEndpoint } from '../types'

export function useMockGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mockEndpoints, setMockEndpoints] = useState<MockEndpoint[]>([])

  const generateMockResponse = (input: string): any => {
    // Simple mock response generation based on input
    if (input.toLowerCase().includes('user')) {
      return {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString()
      }
    }
    
    if (input.toLowerCase().includes('product')) {
      return {
        id: 1,
        name: "Sample Product",
        price: 99.99,
        description: "A sample product description",
        inStock: true
      }
    }
    
    return {
      message: "Mock data generated",
      data: { id: 1, value: "sample" },
      timestamp: new Date().toISOString()
    }
  }

  const generateMockEndpoints = async (input: string) => {
    setIsGenerating(true)
    
    // Simulate generating mock endpoints
    setTimeout(() => {
      const newEndpoints: MockEndpoint[] = [
        {
          id: '1',
          method: 'GET',
          path: '/api/users',
          response: generateMockResponse(input),
          status: 'generating'
        },
        {
          id: '2',
          method: 'POST',
          path: '/api/users',
          response: generateMockResponse(input),
          status: 'generating'
        }
      ]
      
      setMockEndpoints(newEndpoints)
      
      // Simulate completion
      setTimeout(() => {
        setMockEndpoints(prev => 
          prev.map(ep => ({ ...ep, status: 'completed' as const }))
        )
        setIsGenerating(false)
      }, 2000)
    }, 1000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return {
    isGenerating,
    mockEndpoints,
    generateMockEndpoints,
    getMethodColor
  }
}
