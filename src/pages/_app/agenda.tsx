import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/agenda')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>teste</div>
}
