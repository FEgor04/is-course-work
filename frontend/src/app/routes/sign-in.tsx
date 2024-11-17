import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/pages/sign-in";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInPage />;
}