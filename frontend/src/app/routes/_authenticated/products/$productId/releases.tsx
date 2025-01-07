import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getProductByIdQueryOptions, ProductLink } from "@/entities/product";
import { CreateReleaseDialogContent } from "@/entities/release";
import { defaultPagination } from "@/shared/api/schemas.ts";
import { SetSidebarBreadcrumbs } from "@/shared/components/sidebar-breadcrumbs.tsx";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb.tsx";
import { Button } from "@/shared/components/ui/button";
import { DialogTrigger } from "@/shared/components/ui/dialog.tsx";
import { useDialog } from "@/shared/hooks/use-dialog.tsx";

export const Route = createFileRoute(
  "/_authenticated/products/$productId/releases",
)({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.prefetchQuery(
      getProductByIdQueryOptions(Number(params.productId)),
    );
  },
});

function RouteComponent() {
  const productId = parseInt(Route.useParams().productId);
  const { data: product } = useSuspenseQuery(
    getProductByIdQueryOptions(productId),
  );
  const { t } = useTranslation("product");
  const { Dialog: CreateDialog } = useDialog();

  return (
    <div>
      <SetSidebarBreadcrumbs>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link search={defaultPagination} to="/products">
                {t("products.label")}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <ProductLink product={product} />
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <ProductLink product={product} section="releases" />
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </SetSidebarBreadcrumbs>
      <header>
        <CreateDialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create</Button>
          </DialogTrigger>
          <CreateReleaseDialogContent />
        </CreateDialog>
      </header>
      <main></main>
    </div>
  );
}
