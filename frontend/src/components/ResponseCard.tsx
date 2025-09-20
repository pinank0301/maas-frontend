import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CheckCircle, Loader2, Copy } from 'lucide-react'
import { MockEndpoint } from '../types'

interface ResponseCardProps {
  endpoint: MockEndpoint
  onCopy: (text: string) => void
}

export function ResponseCard({ endpoint, onCopy }: ResponseCardProps) {
  return (
    <Card className="p-4 hover-lift">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-mono">
              {endpoint.method} {endpoint.path}
            </Badge>
            {endpoint.status === 'generating' && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {endpoint.status === 'completed' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(JSON.stringify(endpoint.response, null, 2))}
            className="p-1 h-8 w-8"
            aria-label="Copy response"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto custom-scrollbar">
          <code>{JSON.stringify(endpoint.response, null, 2)}</code>
        </pre>
      </div>
    </Card>
  )
}
