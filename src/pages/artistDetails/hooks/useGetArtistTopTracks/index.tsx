import { useQuery } from "@tanstack/react-query";
import { getArtistTopTracks } from "./actions/getArtistTopTracks";
import { FETCH_TAGS } from "@/constants/fetchTags";

export const useGetArtistTopTracks = (artistId: string) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.TOP_TRACKS, artistId],
		queryFn: () => getArtistTopTracks(artistId),
		enabled: !!artistId,
	});
};

