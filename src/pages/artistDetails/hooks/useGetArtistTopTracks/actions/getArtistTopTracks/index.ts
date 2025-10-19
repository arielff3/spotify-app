import type { SpotifyArtistTopTracksResponse } from "@/types/spotify";
import { fetchAPI } from "@/utils/fetchAPI";

export const getArtistTopTracks = async (
	artistId: string,
) => {
	const response: SpotifyArtistTopTracksResponse = await fetchAPI(`/artists/${artistId}/top-tracks?market=US`);
	return response;
};

