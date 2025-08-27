import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="font-bold text-2xl text-foreground">
            404 - Página não encontrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            A página que você está procurando não existe ou foi movida.
            Verifique o endereço digitado ou retorne à página inicial.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full" size="default">
              <Link to={ROUTES.HOME}>
                <Home className="mr-2 h-4 w-4" />
                Voltar ao início
              </Link>
            </Button>
            <Button
              className="w-full"
              onClick={() => window.history.back()}
              size="default"
              type="button"
              variant="outline"
            >
              Voltar à página anterior
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
