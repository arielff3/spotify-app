import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { GlobalLoading } from "@/components/ui/global-loading";
import { useDebounce } from "@/hooks/useDebounce";
import { Filters } from "@/pages/artists/components/filters";
import { useFilters } from "@/pages/artists/hooks/useFilters";
import { FilterTypes } from "@/pages/artists/hooks/useFilters/types";
import { AlbumCard } from "./components/albumCard";
import { ArtistCard } from "./components/artistCard";
import { useGetAllArtists } from "./hooks/useGetAllArtists";

export const ArtistsPage = () => {
  const { query, type, page, setPage } = useFilters();
  const debouncedSearch = useDebounce(query, 500);
  const { t } = useTranslation();

  const { data, isLoading, isError } = useGetAllArtists({
    page,
    search: debouncedSearch,
    type,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            {t("pages.artists.errorLoading", {
              type:
                type === FilterTypes.ALBUM
                  ? t("pages.artists.albums").toLowerCase()
                  : t("pages.artists.artists"),
            })}
          </h2>
          <p className="text-muted-foreground">
            {t("pages.artists.errorMessage")}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.total / 20);
  const isAlbumType = type === FilterTypes.ALBUM;
  const itemType = isAlbumType
    ? t("pages.artists.albums").toLowerCase()
    : t("pages.artists.artists");

  return (
    <section className="container mx-auto px-4 py-8">
      {isLoading && <GlobalLoading />}
      <div className="w-full flex justify-between items-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isAlbumType
              ? t("pages.artists.albumsTitleSpotify")
              : t("pages.artists.titleSpotify")}
          </h1>
          <p className="text-muted-foreground">
            {t("pages.artists.discover", { itemType })} •{" "}
            {data.total.toLocaleString()} {itemType} {t("pages.artists.found")}
          </p>
        </div>

        <Filters />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isAlbumType
          ? data.albums?.map((album) => <AlbumCard key={album.id} album={album} />)
          : data.artists?.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("common.previous")}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("common.page")} {page} {t("common.of")} {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data.hasMore}
        >
          {t("common.next")}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </section>
  );
};
