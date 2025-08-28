import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/agenda/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/agenda/new"!</div>
}
