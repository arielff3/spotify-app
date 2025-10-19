import { createFileRoute } from "@tanstack/react-router";
import { ArtistsPage } from "@/pages/artists";

export const Route = createFileRoute("/")({
	component: ArtistsPage,
});
