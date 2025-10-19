import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalLoading } from "@/components/ui/global-loading";
import { AlbumsTable } from "@/pages/artistDetails/components/albumsTable";
import { TopTracksTable } from "@/pages/artistDetails/components/topTracksTable";
import { TracksPopularityChart } from "@/pages/artistDetails/components/tracksPopularityChart";
import { AlbumsTimelineChart } from "@/pages/artistDetails/components/albumsTimelineChart";
import { useGetArtistAlbums } from "@/pages/artistDetails/hooks/useGetArtistAlbums";
import { useGetArtistDetails } from "@/pages/artistDetails/hooks/useGetArtistDetails";
import { useGetArtistTopTracks } from "@/pages/artistDetails/hooks/useGetArtistTopTracks";

export const ArtistDetailsPage = () => {
	const { artistId } = useParams({ from: "/artists/$artistId" });
	const { t } = useTranslation();

	const { data: artist, isLoading: isLoadingArtist } =
		useGetArtistDetails(artistId);
	const { data: albumsData, isLoading: isLoadingAlbums } =
		useGetArtistAlbums(artistId);
	const { data: topTracksData, isLoading: isLoadingTopTracks } =
		useGetArtistTopTracks(artistId);

	const isLoading = isLoadingArtist || isLoadingAlbums || isLoadingTopTracks;

	if (isLoading) {
		return <GlobalLoading />;
	}

	if (!artist) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-destructive mb-2">
						{t("pages.artistDetails.artistNotFound")}
					</h2>
					<Link to="/">
						<Button variant="outline" className="mt-4">
							<ArrowLeft className="w-4 h-4 mr-2" />
							{t("pages.artistDetails.backToArtists")}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const formatFollowers = (count: number) => {
		return new Intl.NumberFormat("pt-BR").format(count);
	};

	return (
		<section className="container mx-auto px-4 py-8">
			<Link to="/">
				<Button variant="ghost" className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("pages.artistDetails.backToArtists")}
				</Button>
			</Link>

			<div className="mb-8 relative">
				<div className="flex flex-col md:flex-row gap-8 items-start">
					<img
						src={artist.images[0]?.url || "/placeholder-artist.png"}
						alt={artist.name}
						className="w-64 h-64 object-cover rounded-lg shadow-lg"
					/>
					<div className="flex-1">
						<h1 className="text-5xl font-bold mb-4">{artist.name}</h1>
						<div className="flex items-center gap-4 text-muted-foreground mb-4">
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5" />
								<span>
									{formatFollowers(artist.followers.total)}{" "}
									{t("pages.artistDetails.followers")}
								</span>
							</div>
							<div>
								{t("pages.artistDetails.popularity")}: {artist.popularity}/100
							</div>
						</div>
						{artist.genres.length > 0 && (
							<div className="mb-4">
								<h3 className="text-sm font-semibold mb-2">
									{t("pages.artistDetails.genres")}
								</h3>
								<div className="flex flex-wrap gap-2">
									{artist.genres.map((genre) => (
										<span
											key={genre}
											className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
										>
											{genre}
										</span>
									))}
								</div>
							</div>
						)}
						<a
							href={artist.external_urls.spotify}
							target="_blank"
							rel="noreferrer"
						>
							<Button className="mt-4">
								{t("pages.artistDetails.openInSpotify")}
								<ExternalLink className="w-4 h-4 ml-2" />
							</Button>
						</a>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				{topTracksData && topTracksData.tracks.length > 0 && (
					<Card className="py-0">
						<CardContent className="pt-6">
							<TracksPopularityChart tracks={topTracksData.tracks} />
						</CardContent>
					</Card>
				)}

				{albumsData && albumsData.items.length > 0 && (
					<Card className="py-0">
						<CardContent className="pt-6">
							<AlbumsTimelineChart albums={albumsData.items} />
						</CardContent>
					</Card>
				)}
			</div>

			{topTracksData && topTracksData.tracks.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>{t("pages.artistDetails.topTracks")}</CardTitle>
					</CardHeader>
					<CardContent>
						<TopTracksTable tracks={topTracksData.tracks} />
					</CardContent>
				</Card>
			)}

			{albumsData && albumsData.items.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>
							{t("pages.artistDetails.albums")} ({albumsData.items.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<AlbumsTable albums={albumsData.items} />
					</CardContent>
				</Card>
			)}
		</section>
	);
};

