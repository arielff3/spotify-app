import { FETCH_TAGS } from "@/constants/fetchTags"
import { getSearchTracks } from "@/pages/favorites/hooks/useSearchTracks/actions/getSearchTracks"
import { useQuery } from "@tanstack/react-query"

export const useSearchTracks = (query: string) => {
  return useQuery({
    queryKey: [FETCH_TAGS.TRACKS.SEARCH, query],
    queryFn: () => getSearchTracks(query),
    enabled: !!query,
  })
}

