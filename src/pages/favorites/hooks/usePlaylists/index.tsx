import { useCallback, useEffect, useState } from "react";
import type { Playlist } from "@/utils/playlistsDB";
import {
	getAllPlaylists,
	deletePlaylist,
	updatePlaylist,
} from "@/utils/playlistsDB";

export const usePlaylists = () => {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadPlaylists = useCallback(async () => {
		try {
			setIsLoading(true);
			const allPlaylists = await getAllPlaylists();
			setPlaylists(allPlaylists);
		} catch (error) {
			console.error("Error loading playlists:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPlaylists();
	}, [loadPlaylists]);

	const removePlaylist = useCallback(
		async (playlistId: string) => {
			await deletePlaylist(playlistId);
			await loadPlaylists();
		},
		[loadPlaylists],
	);

	const updatePlaylistData = useCallback(
		async (
			playlistId: string,
			updates: Partial<Omit<Playlist, "id" | "createdAt">>,
		) => {
			await updatePlaylist(playlistId, updates);
			await loadPlaylists();
		},
		[loadPlaylists],
	);

	return {
		playlists,
		isLoading,
		loadPlaylists,
		removePlaylist,
		updatePlaylistData,
	};
};

