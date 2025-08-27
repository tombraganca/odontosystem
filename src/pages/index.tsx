import { createFileRoute, Navigate } from '@tanstack/react-router'
import { ROUTES } from '../constants/routes'

export const Route = createFileRoute('/')({
  component: () => <Navigate replace to={ROUTES.SIGNIN} />,
})
