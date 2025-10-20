import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { PlaylistsProvider } from "./contexts/PlaylistsContext";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import "./i18n";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<NuqsAdapter>
				<QueryClientProvider client={queryClient}>
					<FavoritesProvider>
						<PlaylistsProvider>
							<RouterProvider router={router} />
						</PlaylistsProvider>
					</FavoritesProvider>
				</QueryClientProvider>
			</NuqsAdapter>
		</StrictMode>,
	);
}
