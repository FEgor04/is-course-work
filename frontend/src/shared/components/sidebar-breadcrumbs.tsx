import { useLayoutEffect } from "@tanstack/react-router";
import React, { createContext, ReactNode, useContext } from "react";

type Context = {
  breadcrumbs: React.ReactNode;
  setBreadcrumbs: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const SidebarBreadcrumbsContext = createContext<Context | null>(null);

export const SidebarBreadcrumbsProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [breadcrumbs, setBreadcrumbs] =
    React.useState<React.ReactNode>(undefined);

  return (
    <SidebarBreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </SidebarBreadcrumbsContext.Provider>
  );
};

export const SidebarBreadcrumbs = () => {
  const context = useContext(SidebarBreadcrumbsContext);
  if (context == null) {
    throw new Error(
      "useSidebarBreadcrumbs should be used within <SidebarBreadcrumbsProvider />",
    );
  }

  return context.breadcrumbs;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useBreadcrumbs(children: ReactNode) {
  const context = useContext(SidebarBreadcrumbsContext);
  if (context == null) {
    throw new Error(
      "SetSidebarBreadcrumbs should be used within <SidebarBreadcrumbsProvider />",
    );
  }

  useLayoutEffect(() => {
    context.setBreadcrumbs(children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return undefined;
}

export const SetSidebarBreadcrumbs = ({
  children,
}: React.PropsWithChildren) => {
  useBreadcrumbs(children);
  return undefined;
};
