import type { FilterTypes } from "@/pages/artists/hooks/useFilters/types";

export interface UseGetAllArtistsParams {
	page: number;
	limit?: number;
	search?: string;
  type?: FilterTypes;
}
