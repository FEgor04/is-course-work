import { Link } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { UserHoverCard } from "@/entities/user";
import { Team } from "../api";
import { TeamLink } from "./team-link";

// eslint-disable-next-line react-refresh/only-export-components
function RenderTranslation({ str }: { str: string }) {
  const { t } = useTranslation("team");
  return t(str);
}

const columnDef: Array<ColumnDef<Team>> = [
    {
        accessorKey: "title",
        header: () => <RenderTranslation str="items.title.label" />,
        cell: ({ row }) => (
            <TeamLink team={row.original} />
        ),
    },
  {
    accessorKey: "scrumMaster",
    header: () => <RenderTranslation str="items.scrumMaster.label" />,
    cell: ({ row }) => {
      return <UserHoverCard user={row.original.scrumMaster} />;
    },
  },
];

export function useProductsTable(data: Array<Team>) {
  return useReactTable({
    columns: columnDef,
    data,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });
}
