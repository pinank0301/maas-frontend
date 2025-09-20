import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Code, Loader2 } from 'lucide-react'
import { EndpointCard } from './EndpointCard'
import { ResponseCard } from './ResponseCard'
import { MockEndpoint } from '../types'

interface MockPanelProps {
  mockEndpoints: MockEndpoint[]
  isGenerating: boolean
  isMobile: boolean
  onCopy: (text: string) => void
  getMethodColor: (method: string) => string
}

export function MockPanel({ 
  mockEndpoints, 
  isGenerating, 
  isMobile, 
  onCopy, 
  getMethodColor 
}: MockPanelProps) {
  return (
    <div className={`${isMobile ? 'w-full h-1/2' : 'w-3/5'} p-6 space-y-6 animate-slide-in-right`}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span>Generated Mock APIs</span>
        </h2>
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Generating mock endpoints...</span>
            </div>
            <Progress value={66} className="w-full" />
          </div>
        )}

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints" className="space-y-4">
            {mockEndpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onCopy={onCopy}
                getMethodColor={getMethodColor}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="responses" className="space-y-4">
            {mockEndpoints.map((endpoint) => (
              <ResponseCard
                key={endpoint.id}
                endpoint={endpoint}
                onCopy={onCopy}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
