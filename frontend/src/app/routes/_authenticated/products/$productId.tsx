import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/products/$productId')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_authenticated/products/$productId!'
}
