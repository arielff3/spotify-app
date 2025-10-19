import { createColumnHelper } from "@tanstack/react-table";
import type { SpotifyAlbum } from "@/types/spotify";
import { formatDate } from "@/pages/artistDetails/components/albumsTable/utils/formatDate";

const columnHelper = createColumnHelper<SpotifyAlbum>();

export const ALBUMS_COLUMNS = [
	columnHelper.accessor("images", {
		id: "cover",
		header: () => "Capa",
		cell: ({ row }) => (
			<img
				src={row.original.images[0]?.url}
				alt={row.original.name}
				className="w-16 h-16 object-cover rounded"
			/>
		),
		enableSorting: false,
	}),
	columnHelper.accessor("name", {
		id: "name",
		header: () => "Nome do Álbum",
		cell: ({ row }) => (
			<a
				href={row.original.external_urls.spotify}
				target="_blank"
				rel="noreferrer"
				className="hover:underline font-medium"
			>
				{row.original.name}
			</a>
		),
	}),
	columnHelper.accessor("release_date", {
		id: "release_date",
		header: () => "Data de Lançamento",
		cell: ({ getValue }) => formatDate(getValue()),
	}),
	columnHelper.accessor("total_tracks", {
		id: "total_tracks",
		header: () => "Faixas",
		cell: ({ getValue }) => (
			<div className="text-center">{getValue()}</div>
		),
	}),
	columnHelper.accessor("album_type", {
		id: "album_type",
		header: () => "Tipo",
		cell: ({ getValue }) => (
			<span className="capitalize">{getValue()}</span>
		),
	}),
];
