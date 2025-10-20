import { useQuery } from "@tanstack/react-query";
import { FETCH_TAGS } from "@/constants/fetchTags";
import { getArtistTopTracks } from "./actions/getArtistTopTracks";

export const useGetArtistTopTracks = (artistId: string) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.TOP_TRACKS, artistId],
		queryFn: () => getArtistTopTracks(artistId),
		enabled: !!artistId,
	});
};
