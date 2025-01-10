import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProductByIdQueryOptions, ProductLink } from "@/entities/product";
import {
  getTaskByIdQueryOptions,
  getTaskCommentsQueryOptions,
  getTaskHistoryQueryOptions,
  Task,
  TaskChangeEntry,
  TaskStatus,
  TaskTypeBadge,
  useCreateTaskCommentMutation,
  useUpdateTaskMutation,
} from "@/entities/task";
import { SelectAssignee } from "@/entities/task";
import { TaskDescription } from "@/entities/task";
import { SelectTaskStatus } from "@/entities/task";
import { User, UserAvatar, UserHoverCard } from "@/entities/user";
import { defaultPagination } from "@/shared/api/schemas.ts";
import { DataTable } from "@/shared/components/data-table.tsx";
import { SetSidebarBreadcrumbs } from "@/shared/components/sidebar-breadcrumbs.tsx";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { getDefaultColumn } from "@/shared/components/ui/default-column.tsx";
import { RichTextEditor } from "@/shared/components/ui/editor.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table.tsx";

export const Route = createFileRoute(
  "/_authenticated/products/$productId/tasks/$taskId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation("task");
  const { t: tProduct } = useTranslation("product");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { productId, taskId } = Route.useParams();
  const { data: product } = useSuspenseQuery(
    getProductByIdQueryOptions(Number(productId)),
  );
  const { data: task } = useSuspenseQuery(
    getTaskByIdQueryOptions({
      productId: Number(productId),
      taskId: Number(taskId),
    }),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useUpdateTaskMutation();

  function handleSetAssignee(assignee: User | undefined) {
    mutate({
      ...task,
      assignee,
    });
  }

  function handleSetStatus(status: TaskStatus) {
    mutate({
      ...task,
      status,
    });
  }

  const handleSaveTitle = () => {
    mutate(
      {
        ...task,
        title: inputRef.current?.value ?? task.title,
      },
      {
        onSuccess: () => setIsEditingTitle(false),
      },
    );
  };
  return (
    <Card className="mx-auto">
      <SetSidebarBreadcrumbs>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link search={defaultPagination} to="/products">
                {tProduct("products.label")}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <ProductLink product={product} />
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <ProductLink product={product} section={"tasks"} />
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link
                to="/products/$productId/tasks/$taskId"
                params={{ productId, taskId }}
              >
                {task.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </SetSidebarBreadcrumbs>
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-row items-center gap-2 text-xl">
          <div className="flex-1">
            {!isEditingTitle && task.title}
            {isEditingTitle && (
              <Input className="h-8" ref={inputRef} defaultValue={task.title} />
            )}
          </div>
          <div className="ml-auto">
            {isEditingTitle ? (
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={handleSaveTitle}
              >
                <SaveIcon />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => setIsEditingTitle(true)}
              >
                <Pencil />
              </Button>
            )}
          </div>
        </CardTitle>
        <TaskDescription task={task} />
      </CardHeader>
      <CardContent className="space-y-8 p-4 [&>*]:space-y-4">
        <div>
          <h2 className="p-2 font-bold">{t("items.label")}</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-[200px]">
                  {t("items.status.label")}
                </TableCell>
                <TableCell>
                  <SelectTaskStatus
                    disabled={isPending}
                    value={task.status}
                    onChange={handleSetStatus}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("items.type.label")}</TableCell>
                <TableCell>
                  <TaskTypeBadge type={task.type} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("items.assignee.label")}</TableCell>
                <TableCell>
                  <SelectAssignee
                    value={task.assignee}
                    onChange={handleSetAssignee}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <TaskComments task={task} />
        <TaskChanges task={task} />
      </CardContent>
    </Card>
  );
}

function TaskComments({ task }: { task: Task }) {
  const { t } = useTranslation("task");
  const { data: comments } = useSuspenseQuery(
    getTaskCommentsQueryOptions({
      productId: task.product.id,
      taskId: task.id,
      page: 1,
      pageSize: 50,
    }),
  );
  const ref = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useCreateTaskCommentMutation();

  function onSend() {
    const value = ref.current?.value;
    if (value == undefined) {
      return;
    }

    mutate(
      {
        productId: task.product.id,
        taskId: task.id,
        content: value,
      },
      {
        onSuccess: () => {
          // TODO: reset
        },
      },
    );
  }

  return (
    <div>
      <h2 className="font-bold">{t("items.comments.label")}</h2>
      <div className="space-y-2">
        {comments.values.length == 0 && (
          <p className="text-muted-foreground">
            {t("items.comments.feedback.noData.label")}
          </p>
        )}
        {comments.values.map((comment) => (
          <Card>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="flex flex-row items-center space-x-2 font-normal">
                <UserAvatar
                  user={comment.author}
                  className="size-8 text-sm font-light"
                />
                <span>{comment.author.fullName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">{comment.content}</CardContent>
          </Card>
        ))}
      </div>
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <Input placeholder={"Leave a comment"} ref={ref} required />
        <div className="flex flex-row justify-end">
          <Button variant="outline" type="submit" size="sm" loading={isPending}>
            {t("items.comments.actions.send.label")}
          </Button>
        </div>
      </form>
    </div>
  );
}

const taskChangesTable: Array<ColumnDef<TaskChangeEntry>> = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <UserHoverCard user={row.original.changedBy} />,
  },
  {
    accessorKey: "changedAt",
    header: "Changed At",
  },
  {
    accessorKey: "field",
    header: "Field",
  },
  {
    accessorKey: "previousValue",
    header: "Previous Value",
    cell: ({ row }) => {
      const { field, previousValue } = row.original;
      if (field == "description") {
        return (
          <RichTextEditor
            value={previousValue}
            onChange={() => {}}
            editable={false}
          />
        );
      }
      return previousValue;
    },
  },
  {
    accessorKey: "newValue",
    header: "New Value",
    cell: ({ row }) => {
      const { field, newValue } = row.original;
      if (field == "description") {
        return (
          <RichTextEditor
            value={newValue}
            onChange={() => {}}
            editable={false}
          />
        );
      }
      return newValue;
    },
  },
];

function TaskChanges({ task }: { task: Task }) {
  const { t } = useTranslation("task");
  const { data: changes } = useSuspenseQuery(
    getTaskHistoryQueryOptions({
      productId: task.product.id,
      taskId: task.id,
      page: 1,
      pageSize: 50,
    }),
  );
  const table = useReactTable({
    columns: taskChangesTable,
    data: changes.values,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    defaultColumn: getDefaultColumn<TaskChangeEntry>(),
  });

  return (
    <div>
      <h2 className="font-bold">{t("items.changes.label")}</h2>
      <DataTable table={table} />
    </div>
  );
}
