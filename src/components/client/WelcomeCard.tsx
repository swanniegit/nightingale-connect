'use client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// CATEGORY: Client Orchestrator
// CONTEXT: Client
export function WelcomeCard() {
  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome to Nightingale Connect</h2>
      <p className="text-muted-foreground mb-6">
        Your healthcare communication platform is ready to use.
      </p>
      <Button className="w-full">
        Get Started
      </Button>
    </Card>
  )
}
