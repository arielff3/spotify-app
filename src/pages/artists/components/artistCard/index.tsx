import { Link } from "@tanstack/react-router";
import { Music2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtistCardProps } from "@/pages/artists/components/artistCard/types";

export const ArtistCard = ({ artist }: ArtistCardProps) => {
	const imageUrl = artist.images[0]?.url || "/placeholder-artist.jpg";
	const followers = artist.followers.total.toLocaleString("pt-BR");
	const { t } = useTranslation();

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 gap-0 py-0">
			<CardHeader className="p-0">
				<Link to="/artists/$artistId" params={{ artistId: artist.id }}>
					<div className="relative aspect-square overflow-hidden cursor-pointer">
						<img
							src={imageUrl}
							alt={artist.name}
							className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
							loading="lazy"
						/>
						{artist.popularity > 0 && (
							<div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
								{artist.popularity}% {t("common.popular")}
							</div>
						)}
					</div>
				</Link>
			</CardHeader>
			<CardContent className="p-4">
				<Link to="/artists/$artistId" params={{ artistId: artist.id }}>
					<CardTitle className="text-lg mb-2 truncate hover:underline cursor-pointer">
						{artist.name}
					</CardTitle>
				</Link>

				<div className="space-y-2 text-sm text-muted-foreground h-20">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4" />
						<span>
							{followers} {t("common.followers")}
						</span>
					</div>

					{artist.genres.length > 0 && (
						<div className="flex items-start gap-2">
							<Music2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
							<div className="flex flex-wrap gap-1">
								{artist.genres.slice(0, 3).map((genre) => (
									<span
										key={genre}
										className="inline-block bg-secondary px-2 py-0.5 rounded text-xs"
									>
										{genre}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="mt-4 space-y-2">
					<Link to="/artists/$artistId" params={{ artistId: artist.id }}>
						<Button variant="default" className="w-full">
							{t("common.viewDetails")}
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};
