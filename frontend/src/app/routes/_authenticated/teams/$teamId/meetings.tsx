import { createFileRoute } from "@tanstack/react-router";
import { getTeamQueryOptions, useTeamsBreadcrumbs } from "@/entities/team";

export const Route = createFileRoute("/_authenticated/teams/$teamId/meetings")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(
      getTeamQueryOptions(Number(params.teamId)),
    );
  },
});

function RouteComponent() {
  const team = Route.useLoaderData();
  useTeamsBreadcrumbs(team, "meetings");

  return "Hello /_authenticated/teams/$teamId/meetings!";
}
