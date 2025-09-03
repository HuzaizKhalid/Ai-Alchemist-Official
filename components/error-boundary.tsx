"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)

    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12 pt-16 md:pt-28">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left bg-muted p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium">
                    Error Details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Page</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children
  }
}
