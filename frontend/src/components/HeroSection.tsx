interface HeroSectionProps {
  children: React.ReactNode
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          MaaS - Mock as a Service
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Generate realistic mock APIs instantly. Describe what you need, and we'll create the perfect mock endpoints for your development.
        </p>
      </div>
      {children}
    </div>
  )
}
