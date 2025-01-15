import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({
      to: "/products"
    })
  }
});

function RouteComponent() {

  return "hello"
}
