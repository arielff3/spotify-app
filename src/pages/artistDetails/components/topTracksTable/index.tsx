import { Heart, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import type { TopTracksTableProps } from "@/pages/artistDetails/components/topTracksTable/types";
import { isFavorite as checkIsFavorite } from "@/utils/favoritesDB";

export const TopTracksTable = ({ tracks }: TopTracksTableProps) => {
	const { t } = useTranslation();
	const {
		actions: { toggleFavorite },
	} = useFavoritesContext();
	const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
		{},
	);

	useEffect(() => {
		const checkFavorites = async () => {
			const states: Record<string, boolean> = {};
			for (const track of tracks) {
				states[track.id] = await checkIsFavorite(track.id);
			}
			setFavoriteStates(states);
		};
		checkFavorites();
	}, [tracks]);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleToggleFavorite = async (track: (typeof tracks)[0]) => {
		await toggleFavorite({
			id: track.id,
			name: track.name,
			artistId: track.artists[0].id,
			artistName: track.artists[0].name,
			albumName: track.album.name,
			albumImage: track.album.images[0]?.url || "",
			duration_ms: track.duration_ms,
			popularity: track.popularity,
			preview_url: track.preview_url,
		});
		setFavoriteStates((prev) => ({
			...prev,
			[track.id]: !prev[track.id],
		}));
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px] text-center">#</TableHead>
						<TableHead>{t("pages.artistDetails.trackName")}</TableHead>
						<TableHead>{t("pages.artistDetails.album")}</TableHead>
						<TableHead className="text-center">
							{t("pages.artistDetails.duration")}
						</TableHead>
						<TableHead className="text-center">
							{t("pages.artistDetails.popularity")}
						</TableHead>
						<TableHead className="text-center w-[120px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tracks.map((track, index) => (
						<TableRow key={track.id}>
							<TableCell className="text-center font-medium">
								{index + 1}
							</TableCell>
							<TableCell className="font-medium">
								<div className="flex items-center gap-3">
									<img
										src={track.album.images[0]?.url}
										alt={track.album.name}
										className="w-10 h-10 object-cover rounded"
									/>
									<div>
										<div className="font-medium">{track.name}</div>
										{track.explicit && (
											<span className="text-xs text-muted-foreground">
												Explicit
											</span>
										)}
									</div>
								</div>
							</TableCell>
							<TableCell>
								<a
									href={track.album.external_urls.spotify}
									target="_blank"
									rel="noreferrer"
									className="hover:underline"
								>
									{track.album.name}
								</a>
							</TableCell>
							<TableCell className="text-center">
								{formatDuration(track.duration_ms)}
							</TableCell>
							<TableCell className="text-center">{track.popularity}</TableCell>
							<TableCell className="text-center">
								<div className="flex items-center justify-center gap-2">
									<Button
										size="icon"
										variant="ghost"
										onClick={() => handleToggleFavorite(track)}
									>
										<Heart
											className={`w-4 h-4 ${favoriteStates[track.id] ? "fill-red-500 text-red-500" : ""}`}
										/>
									</Button>
									{track.preview_url && (
										<a
											href={track.preview_url}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
										>
											<Play className="w-4 h-4" />
										</a>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
