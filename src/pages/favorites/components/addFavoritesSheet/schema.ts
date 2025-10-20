import { z } from "zod";

export const addFavoritesSchema = z
	.object({
		searchQuery: z
			.string()
			.min(2, "Digite pelo menos 2 caracteres para buscar")
			.max(100, "Consulta muito longa"),
		selectedTracks: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
					artistId: z.string(),
					artistName: z.string(),
					albumName: z.string(),
					albumImage: z.string(),
					duration_ms: z.number(),
					popularity: z.number(),
					preview_url: z.string().nullable(),
				}),
			)
			.min(1, "Selecione pelo menos 1 música")
			.max(10, "Você pode adicionar no máximo 10 músicas por vez"),
		addToPlaylist: z.boolean().optional(),
		playlistName: z
			.string()
			.min(1, "Nome da playlist é obrigatório")
			.max(100, "Nome muito longo (máximo 100 caracteres)")
			.optional(),
		playlistNotes: z
			.string()
			.max(500, "Notas muito longas (máximo 500 caracteres)")
			.optional(),
	})
	.refine(
		(data) => {
			if (data.addToPlaylist && !data.playlistName) {
				return false;
			}
			return true;
		},
		{
			message: "Nome da playlist é obrigatório quando criar uma playlist",
			path: ["playlistName"],
		},
	);

export type AddFavoritesFormData = z.infer<typeof addFavoritesSchema>;

export interface SpotifyTrackSearchResult {
	id: string;
	name: string;
	artists: Array<{ id: string; name: string }>;
	album: {
		name: string;
		images: Array<{ url: string }>;
	};
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
}
