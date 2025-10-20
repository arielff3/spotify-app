import { Calendar, Disc3, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlbumCardProps } from "@/pages/artists/components/albumCard/types";

export const AlbumCard = ({ album }: AlbumCardProps) => {
	const imageUrl = album.images[0]?.url || "/placeholder-album.jpg";
	const releaseYear = new Date(album.release_date).getFullYear();
	const { t } = useTranslation();

	const albumType =
		album.album_type === "album"
			? t("pages.artists.album")
			: album.album_type === "single"
				? t("pages.artists.single")
				: t("pages.artists.compilation");

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 gap-0 py-0">
			<CardHeader className="p-0">
				<div className="relative aspect-square overflow-hidden">
					<img
						src={imageUrl}
						alt={album.name}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
						loading="lazy"
					/>
					<div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
						{albumType}
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<CardTitle className="text-lg mb-2 truncate">{album.name}</CardTitle>

				<div className="space-y-2 text-sm text-muted-foreground h-20">
					<div className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span className="truncate">{album.artists[0]?.name}</span>
					</div>

					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						<span>{releaseYear}</span>
					</div>

					<div className="flex items-center gap-2">
						<Disc3 className="h-4 w-4" />
						<span>
							{album.total_tracks}{" "}
							{album.total_tracks === 1 ? "faixa" : "faixas"}
						</span>
					</div>
				</div>

				<a
					href={album.external_urls.spotify}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 inline-block w-full text-center bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
				>
					Abrir no Spotify
				</a>
			</CardContent>
		</Card>
	);
};
