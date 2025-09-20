import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CheckCircle, Loader2, Copy } from 'lucide-react'
import { MockEndpoint } from '../types'

interface EndpointCardProps {
  endpoint: MockEndpoint
  onCopy: (text: string) => void
  getMethodColor: (method: string) => string
}

export function EndpointCard({ endpoint, onCopy, getMethodColor }: EndpointCardProps) {
  return (
    <Card className="p-4 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge 
            className={`font-mono ${getMethodColor(endpoint.method)}`}
          >
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono">{endpoint.path}</code>
        </div>
        <div className="flex items-center space-x-2">
          {endpoint.status === 'generating' && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {endpoint.status === 'completed' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(`${endpoint.method} ${endpoint.path}`)}
            className="p-1 h-8 w-8"
            aria-label="Copy endpoint"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
