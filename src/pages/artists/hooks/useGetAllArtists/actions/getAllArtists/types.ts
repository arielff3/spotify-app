import type { FilterTypes } from "@/pages/artists/hooks/useFilters/types";

export interface FetchArtistsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: FilterTypes; 
}
