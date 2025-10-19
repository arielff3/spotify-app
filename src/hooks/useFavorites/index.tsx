import { useCallback, useEffect, useState } from "react";
import type { FavoriteTrack } from "@/utils/favoritesDB";
import {
	addFavorite as addFavoriteDB,
	clearAllFavorites,
	getAllFavorites,
	getFavoritesByArtist,
	isFavorite as isFavoriteDB,
	removeFavorite as removeFavoriteDB,
} from "@/utils/favoritesDB";

export const useFavorites = () => {
	const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadFavorites = useCallback(async () => {
		try {
			setIsLoading(true);
			const allFavorites = await getAllFavorites();
			setFavorites(allFavorites);
		} catch (error) {
			console.error("Error loading favorites:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadFavorites();
	}, [loadFavorites]);

	const addFavorite = useCallback(
		async (track: Omit<FavoriteTrack, "addedAt">) => {
			try {
				await addFavoriteDB(track);
				await loadFavorites();
			} catch (error) {
				console.error("Error adding favorite:", error);
				throw error;
			}
		},
		[loadFavorites],
	);

	const removeFavorite = useCallback(
		async (trackId: string) => {
			try {
				await removeFavoriteDB(trackId);
				await loadFavorites();
			} catch (error) {
				console.error("Error removing favorite:", error);
				throw error;
			}
		},
		[loadFavorites],
	);

	const toggleFavorite = useCallback(
		async (track: Omit<FavoriteTrack, "addedAt">) => {
			const isFav = await isFavoriteDB(track.id);
			if (isFav) {
				await removeFavorite(track.id);
			} else {
				await addFavorite(track);
			}
		},
		[addFavorite, removeFavorite],
	);

	const clearAll = useCallback(async () => {
		try {
			await clearAllFavorites();
			await loadFavorites();
		} catch (error) {
			console.error("Error clearing favorites:", error);
			throw error;
		}
	}, [loadFavorites]);

	const getFavoritesByArtistId = useCallback(async (artistId: string) => {
		try {
			return await getFavoritesByArtist(artistId);
		} catch (error) {
			console.error("Error getting favorites by artist:", error);
			return [];
		}
	}, []);

	const groupedByArtist = useCallback(() => {
		const grouped = favorites.reduce(
			(acc, track) => {
				if (!acc[track.artistId]) {
					acc[track.artistId] = {
						artistName: track.artistName,
						tracks: [],
					};
				}
				acc[track.artistId].tracks.push(track);
				return acc;
			},
			{} as Record<
				string,
				{ artistName: string; tracks: FavoriteTrack[] }
			>,
		);
		return grouped;
	}, [favorites]);

	return {
		favorites,
		isLoading,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		clearAll,
		getFavoritesByArtistId,
		groupedByArtist,
		refreshFavorites: loadFavorites,
	};
};

export const useIsFavorite = (trackId: string) => {
	const [isFav, setIsFav] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const checkFavorite = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await isFavoriteDB(trackId);
			setIsFav(result);
		} catch (error) {
			console.error("Error checking favorite:", error);
		} finally {
			setIsLoading(false);
		}
	}, [trackId]);

	useEffect(() => {
		checkFavorite();
	}, [checkFavorite]);

	return { isFavorite: isFav, isLoading, refreshStatus: checkFavorite };
};

