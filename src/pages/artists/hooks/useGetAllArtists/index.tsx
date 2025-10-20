import { useQuery } from "@tanstack/react-query";
import { FETCH_TAGS } from "@/constants/fetchTags";
import { fetchArtists } from "@/pages/artists/hooks/useGetAllArtists/actions/getAllArtists";
import type { UseGetAllArtistsParams } from "@/pages/artists/hooks/useGetAllArtists/types";

export const useGetAllArtists = ({
	page,
	limit = 20,
	search,
	type,
}: UseGetAllArtistsParams) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.ALL, page, limit, search, type],
		queryFn: () => fetchArtists({ page, limit, search, type }),
		staleTime: 5 * 60 * 1000,
	});
};
