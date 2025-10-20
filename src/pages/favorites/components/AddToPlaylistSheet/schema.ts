import { z } from "zod";

export const addToPlaylistSchema = z.object({
	searchQuery: z
		.string()
		.min(2, "Digite pelo menos 2 caracteres para buscar")
		.max(100, "Consulta muito longa"),
	selectedTrackIds: z
		.array(z.string())
		.min(1, "Selecione pelo menos 1 música")
		.max(10, "Você pode adicionar no máximo 10 músicas por vez"),
});

export type AddToPlaylistFormData = z.infer<typeof addToPlaylistSchema>;
