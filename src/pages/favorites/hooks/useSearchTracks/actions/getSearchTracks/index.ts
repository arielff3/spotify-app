import type { SpotifyTrackSearchResult } from "@/pages/favorites/components/addFavoritesSheet/schema";
import { fetchAPI } from "@/utils/fetchAPI";

export const getSearchTracks = async (query: string) => {
	const response: { tracks: { items: SpotifyTrackSearchResult[] } } =
		await fetchAPI(`/search?q=${query}&type=track`);
	return response.tracks.items;
};
