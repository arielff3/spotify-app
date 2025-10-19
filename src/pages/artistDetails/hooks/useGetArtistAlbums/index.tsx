import { useQuery } from "@tanstack/react-query";
import { getArtistAlbums } from "./actions/getArtistAlbums";
import { FETCH_TAGS } from "@/constants/fetchTags";

export const useGetArtistAlbums = (artistId: string) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.ALBUMS, artistId],
		queryFn: () => getArtistAlbums(artistId),
		enabled: !!artistId,
	});
};

