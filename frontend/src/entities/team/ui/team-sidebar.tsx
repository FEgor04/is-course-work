import { useQuery } from "@tanstack/react-query";
import { TeamLink } from "@/entities/team";
import { getPrincipalTeamsQueryOptions, Team } from "@/entities/team/api";
import { defaultPagination } from "@/shared/api/schemas.ts";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar.tsx";
import { FeatureFlag } from "@/shared/lib/feature-flags.tsx";

export function TeamsSidebar() {
  const { data, isPending, error } = useQuery(
    getPrincipalTeamsQueryOptions(defaultPagination),
  );

  if (error) {
    return error.message;
  }

  if (isPending) {
    return <TeamsSidebarSkeleton />;
  }

  return (
    <SidebarMenu>
      {data.values.map((team) => (
        <TeamSidebarEntry key={team.id} team={team} />
      ))}
    </SidebarMenu>
  );
}

function TeamSidebarEntry({ team }: { team: Team }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <TeamLink team={team} />
      </SidebarMenuButton>
      <SidebarMenuSub>
        {(["meetings", "sprints"] as const).map((section) => (
          <>
            <FeatureFlag key={section} flag={`teams.${section}`}>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <TeamLink team={team} section={section} />
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </FeatureFlag>
          </>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export function TeamsSidebarSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
