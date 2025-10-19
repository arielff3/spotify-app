import { FilterTypes } from "@/pages/artists/hooks/useFilters/types";
import type { FetchArtistsParams } from "@/pages/artists/hooks/useGetAllArtists/actions/getAllArtists/types";
import type { SpotifySearchResponse } from "@/types/spotify";
import { fetchAPI } from "@/utils/fetchAPI";

export const fetchArtists = async ({
	page = 1,
	limit = 20,
	search = "",
	type = FilterTypes.ARTIST,
}: FetchArtistsParams) => {
	const offset = (page - 1) * limit;

	const query = search ? `${search}` : "year:2026";
	const url = `/search?q=${query}&type=${type}&offset=${offset}&limit=${limit}`;

	const response: SpotifySearchResponse = await fetchAPI(url);

	if (type === FilterTypes.ALBUM) {
		return {
			albums: response.albums?.items || [],
			total: response.albums?.total || 0,
			hasMore: response.albums?.next !== null,
			currentPage: page,
		};
	}

	return {
		artists: response.artists?.items || [],
		total: response.artists?.total || 0,
		hasMore: response.artists?.next !== null,
		currentPage: page,
	};
};
