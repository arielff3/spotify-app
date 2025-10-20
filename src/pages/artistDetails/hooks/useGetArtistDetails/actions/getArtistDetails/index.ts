import type { SpotifyArtistDetails } from "@/types/spotify";
import { fetchAPI } from "@/utils/fetchAPI";

export const getArtistDetails = async (artistId: string) => {
	const response: SpotifyArtistDetails = await fetchAPI(`/artists/${artistId}`);
	return response;
};
