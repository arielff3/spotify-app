import type { SpotifyArtistAlbumsResponse } from "@/types/spotify";
import { fetchAPI } from "@/utils/fetchAPI";

export const getArtistAlbums = async (
	artistId: string,
	limit = 50,
): Promise<SpotifyArtistAlbumsResponse> => {
	return fetchAPI(
		`/artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
	);
};
