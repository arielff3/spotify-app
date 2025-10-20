import { useQuery } from "@tanstack/react-query";
import { FETCH_TAGS } from "@/constants/fetchTags";
import { getArtistAlbums } from "./actions/getArtistAlbums";

export const useGetArtistAlbums = (artistId: string) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.ALBUMS, artistId],
		queryFn: () => getArtistAlbums(artistId),
		enabled: !!artistId,
	});
};
