import { createFileRoute } from "@tanstack/react-router";
import { ArtistDetailsPage } from "@/pages/artistDetails";

export const Route = createFileRoute("/artists/$artistId")({
	component: ArtistDetailsPage,
});
