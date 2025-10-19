import { Heart, Music, Trash2, ListMusic, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/components/ui/empty";
import { GlobalLoading } from "@/components/ui/global-loading";
import { useFavorites } from "@/hooks/useFavorites";
import { usePlaylists } from "@/pages/favorites/hooks/usePlaylists";
import { AddFavoritesSheet } from "./components/addFavoritesSheet";
import { AddToPlaylistSheet } from "./components/AddToPlaylistSheet";
import { parseAsStringEnum, useQueryState } from "nuqs";

export const FavoritesPage = () => {
	const [tab, setTab] = useQueryState("tab", parseAsStringEnum(["favorites", "playlists"]));
	const { t } = useTranslation();
	const { groupedByArtist, isLoading, removeFavorite, clearAll, favorites } =
		useFavorites();

	const {
		playlists,
		isLoading: playlistsLoading,
		removePlaylist,
	} = usePlaylists();

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleRemoveFavorite = async (trackId: string) => {
		try {
			await removeFavorite(trackId);
		} catch (error) {
			console.error("Error removing favorite:", error);
		}
	};

	const handleClearAll = async () => {
		try {
			await clearAll();
		} catch (error) {
			console.error("Error clearing favorites:", error);
		}
	};

	if (isLoading || playlistsLoading) {
		return <GlobalLoading />;
	}

	const grouped = groupedByArtist();
	const artistIds = Object.keys(grouped);

	const hasNoData = artistIds.length === 0 && playlists.length === 0;

	return (
		<section className="container mx-auto px-4 py-8 max-w-5xl">
			<div className="mb-6 flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-4xl font-bold flex items-center gap-3">
						<Heart className="w-8 h-8 text-red-500 fill-red-500" />
						{t("pages.favorites.title")}
					</h1>
					<p className="text-muted-foreground mt-2">
						{t("pages.favorites.subtitle")}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<AddFavoritesSheet />
					{favorites.length > 0 && (
						<Button variant="destructive" onClick={handleClearAll}>
							<Trash2 className="w-4 h-4 mr-2" />
							{t("pages.favorites.clearAll")}
						</Button>
					)}
				</div>
			</div>

			{hasNoData && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Music />
						</EmptyMedia>
						<EmptyTitle>{t("pages.favorites.empty.title")}</EmptyTitle>
						<EmptyDescription>
							{t("pages.favorites.empty.description")}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			{!hasNoData && (
				<Tabs defaultValue={tab || "favorites"} className="w-full" onValueChange={(value) => setTab(value as "favorites" | "playlists")}>
					<TabsList>
						<TabsTrigger value="favorites" className="flex items-center gap-2">
							<Heart className="w-4 h-4" />
							{t("pages.favorites.allFavorites")} ({favorites.length})
						</TabsTrigger>
						<TabsTrigger value="playlists" className="flex items-center gap-2">
							<ListMusic className="w-4 h-4" />
							{t("pages.favorites.playlistsTab")} ({playlists.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="favorites" className="space-y-6">
						{artistIds.length > 0 && (
							<div className="space-y-6">
								{artistIds.map((artistId) => {
									const { artistName, tracks } = grouped[artistId];
									return (
										<Card key={artistId}>
											<CardHeader>
												<CardTitle className="flex items-center justify-between">
													<Link
														to="/artists/$artistId"
														params={{ artistId }}
														className="hover:underline"
													>
														{artistName}
													</Link>
													<span className="text-sm font-normal text-muted-foreground">
														{tracks.length}{" "}
														{tracks.length === 1
															? t("pages.favorites.track")
															: t("pages.favorites.tracks")}
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													{tracks.map((track) => (
														<div
															key={track.id}
															className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors group"
														>
															<img
																src={track.albumImage}
																alt={track.albumName}
																className="w-12 h-12 rounded object-cover"
															/>
															<div className="flex-1 min-w-0">
																<h3 className="font-semibold truncate">
																	{track.name}
																</h3>
																<p className="text-sm text-muted-foreground truncate">
																	{track.albumName}
																</p>
															</div>
															<div className="flex items-center gap-4">
																<span className="text-sm text-muted-foreground">
																	{formatDuration(track.duration_ms)}
																</span>
																<Button
																	size="icon"
																	variant="ghost"
																	onClick={() => handleRemoveFavorite(track.id)}
																	className="opacity-0 group-hover:opacity-100 transition-opacity"
																>
																	<Heart className="w-4 h-4 fill-red-500 text-red-500" />
																</Button>
															</div>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						)}
					</TabsContent>

					<TabsContent value="playlists" className="space-y-6">
						{playlists.length === 0 ? (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<ListMusic />
									</EmptyMedia>
									<EmptyTitle>{t("pages.favorites.noPlaylistsTitle")}</EmptyTitle>
									<EmptyDescription>
										{t("pages.favorites.noPlaylistsDescription")}
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : (
							playlists.map((playlist) => {
								const playlistTracks = favorites.filter((track) =>
									playlist.trackIds.includes(track.id),
								);
								return (
									<Card key={playlist.id}>
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<ListMusic className="w-5 h-5" />
													{playlist.name}
												</div>
												<div className="flex items-center gap-2">
													<span className="text-sm font-normal text-muted-foreground">
														{playlistTracks.length}{" "}
														{playlistTracks.length === 1
															? t("pages.favorites.track")
															: t("pages.favorites.tracks")}
													</span>
													<AddToPlaylistSheet
														playlistId={playlist.id}
														playlistName={playlist.name}
														existingTrackIds={playlist.trackIds}
													/>
													<Button
														size="icon"
														variant="ghost"
														onClick={() => removePlaylist(playlist.id)}
													>
														<Trash className="w-4 h-4" />
													</Button>
												</div>
											</CardTitle>
											{playlist.notes && (
												<p className="text-sm text-muted-foreground mt-2">
													{playlist.notes}
												</p>
											)}
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{playlistTracks.map((track) => (
													<div
														key={track.id}
														className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
													>
														<img
															src={track.albumImage}
															alt={track.albumName}
															className="w-12 h-12 rounded object-cover"
														/>
														<div className="flex-1 min-w-0">
															<h3 className="font-semibold truncate">
																{track.name}
															</h3>
															<p className="text-sm text-muted-foreground truncate">
																{track.artistName} • {track.albumName}
															</p>
														</div>
														<span className="text-sm text-muted-foreground">
															{formatDuration(track.duration_ms)}
														</span>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								);
							})
						)}
					</TabsContent>
				</Tabs>
			)}
		</section>
	);
};

