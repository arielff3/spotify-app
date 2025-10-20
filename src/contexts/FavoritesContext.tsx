import type React from "react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import type { FavoriteTrack } from "@/utils/favoritesDB";
import {
	addFavorite as addFavoriteDB,
	clearAllFavorites,
	getAllFavorites,
	getFavoritesByArtist,
	isFavorite as isFavoriteDB,
	removeFavorite as removeFavoriteDB,
} from "@/utils/favoritesDB";

type FavoritesState = {
	favorites: FavoriteTrack[];
	isLoading: boolean;
	error: string | null;
};

type FavoritesAction =
	| { type: "LOAD_START" }
	| { type: "LOAD_SUCCESS"; payload: FavoriteTrack[] }
	| { type: "LOAD_ERROR"; payload: string }
	| { type: "ADD_FAVORITE"; payload: FavoriteTrack }
	| { type: "REMOVE_FAVORITE"; payload: string }
	| { type: "CLEAR_ALL" };

const favoritesReducer = (
	state: FavoritesState,
	action: FavoritesAction,
): FavoritesState => {
	switch (action.type) {
		case "LOAD_START":
			return { ...state, isLoading: true, error: null };
		case "LOAD_SUCCESS":
			return { ...state, isLoading: false, favorites: action.payload };
		case "LOAD_ERROR":
			return { ...state, isLoading: false, error: action.payload };
		case "ADD_FAVORITE":
			return { ...state, favorites: [action.payload, ...state.favorites] };
		case "REMOVE_FAVORITE":
			return {
				...state,
				favorites: state.favorites.filter((f) => f.id !== action.payload),
			};
		case "CLEAR_ALL":
			return { ...state, favorites: [] };
		default:
			return state;
	}
};

type FavoritesContextType = {
	state: FavoritesState;
	dispatch: React.Dispatch<FavoritesAction>;
	actions: {
		addFavorite: (track: Omit<FavoriteTrack, "addedAt">) => Promise<void>;
		removeFavorite: (trackId: string) => Promise<void>;
		toggleFavorite: (track: Omit<FavoriteTrack, "addedAt">) => Promise<void>;
		clearAll: () => Promise<void>;
		refreshFavorites: () => Promise<void>;
		getFavoritesByArtistId: (artistId: string) => Promise<FavoriteTrack[]>;
		groupedByArtist: () => Record<
			string,
			{ artistName: string; tracks: FavoriteTrack[] }
		>;
	};
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(favoritesReducer, {
		favorites: [],
		isLoading: true,
		error: null,
	});

	const loadFavorites = useCallback(async () => {
		dispatch({ type: "LOAD_START" });
		try {
			const favorites = await getAllFavorites();
			dispatch({ type: "LOAD_SUCCESS", payload: favorites });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao carregar favoritos";
			dispatch({ type: "LOAD_ERROR", payload: errorMessage });
			console.error("Error loading favorites:", error);
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

	const removeFavorite = useCallback(async (trackId: string) => {
		try {
			await removeFavoriteDB(trackId);
			dispatch({ type: "REMOVE_FAVORITE", payload: trackId });
		} catch (error) {
			console.error("Error removing favorite:", error);
			throw error;
		}
	}, []);

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
			dispatch({ type: "CLEAR_ALL" });
		} catch (error) {
			console.error("Error clearing favorites:", error);
			throw error;
		}
	}, []);

	const getFavoritesByArtistId = useCallback(
		async (artistId: string): Promise<FavoriteTrack[]> => {
			try {
				return await getFavoritesByArtist(artistId);
			} catch (error) {
				console.error("Error getting favorites by artist:", error);
				return [];
			}
		},
		[],
	);

	const groupedByArtist = useCallback(() => {
		const grouped = state.favorites.reduce(
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
			{} as Record<string, { artistName: string; tracks: FavoriteTrack[] }>,
		);
		return grouped;
	}, [state.favorites]);

	return (
		<FavoritesContext.Provider
			value={{
				state,
				dispatch,
				actions: {
					addFavorite,
					removeFavorite,
					toggleFavorite,
					clearAll,
					refreshFavorites: loadFavorites,
					getFavoritesByArtistId,
					groupedByArtist,
				},
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
};

export const useFavoritesContext = () => {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error(
			"useFavoritesContext must be used within FavoritesProvider",
		);
	}
	return context;
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
