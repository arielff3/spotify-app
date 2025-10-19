import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LanguageSwitcher } from "@/components/core/languageSwitcher";
import { Header } from "@/components/core/header";

const RootLayout = () => (
	<>
		<Header />
		<Outlet />
		<LanguageSwitcher />
		<TanStackRouterDevtools />
	</>
);

export const Route = createRootRoute({ component: RootLayout });
