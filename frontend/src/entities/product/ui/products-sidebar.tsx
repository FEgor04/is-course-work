import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ProductLink } from "@/entities/product";
import {
  getPrincipalProductsQueryOptions,
  Product,
} from "@/entities/product/api";
import { defaultPagination } from "@/shared/api/schemas.ts";
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar.tsx";
import { FeatureFlag } from "@/shared/lib/feature-flags.tsx";

export function ProductsSidebar() {
  const { data, isPending, error } = useQuery(
    getPrincipalProductsQueryOptions(defaultPagination),
  );

  if (error) {
    return error.message;
  }

  if (isPending) {
    return <ProductsSidebarSkeleton />;
  }

  return (
    <SidebarMenu>
      {data.values.map((product) => (
        <ProductSidebarEntry key={product.id} product={product} />
      ))}
    </SidebarMenu>
  );
}

function ProductSidebarEntry({ product }: { product: Product }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={`/products/$productId`}
          params={{ productId: String(product.id) }}
        >
          {product.title}
          <SidebarMenuBadge>[{product.ticker}]</SidebarMenuBadge>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuSub>
        {(["issues", "releases"] as const).map((section) => (
          <>
            <FeatureFlag key={section} flag={`products.${section}`}>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <ProductLink product={product} section={section} />
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </FeatureFlag>
          </>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export function ProductsSidebarSkeleton() {
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
