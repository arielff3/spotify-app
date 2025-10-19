import { useQuery } from "@tanstack/react-query";
import { getArtistDetails } from "./actions/getArtistDetails";
import { FETCH_TAGS } from "@/constants/fetchTags";

export const useGetArtistDetails = (artistId: string) => {
	return useQuery({
		queryKey: [FETCH_TAGS.ARTISTS.DETAILS, artistId],
		queryFn: () => getArtistDetails(artistId),
		enabled: !!artistId,
	});
};
