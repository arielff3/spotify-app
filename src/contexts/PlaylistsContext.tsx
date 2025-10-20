import type React from "react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from "react";
import type { Playlist } from "@/utils/playlistsDB";
import {
	createPlaylist,
	deletePlaylist,
	getAllPlaylists,
	updatePlaylist,
} from "@/utils/playlistsDB";

type PlaylistsState = {
	playlists: Playlist[];
	isLoading: boolean;
	error: string | null;
};

type PlaylistsAction =
	| { type: "LOAD_START" }
	| { type: "LOAD_SUCCESS"; payload: Playlist[] }
	| { type: "LOAD_ERROR"; payload: string }
	| { type: "ADD_PLAYLIST"; payload: Playlist }
	| { type: "UPDATE_PLAYLIST"; payload: { id: string; playlist: Playlist } }
	| { type: "REMOVE_PLAYLIST"; payload: string };

const playlistsReducer = (
	state: PlaylistsState,
	action: PlaylistsAction,
): PlaylistsState => {
	switch (action.type) {
		case "LOAD_START":
			return { ...state, isLoading: true, error: null };
		case "LOAD_SUCCESS":
			return { ...state, isLoading: false, playlists: action.payload };
		case "LOAD_ERROR":
			return { ...state, isLoading: false, error: action.payload };
		case "ADD_PLAYLIST":
			return { ...state, playlists: [action.payload, ...state.playlists] };
		case "UPDATE_PLAYLIST":
			return {
				...state,
				playlists: state.playlists.map((p) =>
					p.id === action.payload.id ? action.payload.playlist : p,
				),
			};
		case "REMOVE_PLAYLIST":
			return {
				...state,
				playlists: state.playlists.filter((p) => p.id !== action.payload),
			};
		default:
			return state;
	}
};

type PlaylistsContextType = {
	state: PlaylistsState;
	dispatch: React.Dispatch<PlaylistsAction>;
	actions: {
		loadPlaylists: () => Promise<void>;
		removePlaylist: (playlistId: string) => Promise<void>;
		updatePlaylistData: (
			playlistId: string,
			updates: Partial<Omit<Playlist, "id" | "createdAt">>,
		) => Promise<void>;
		createNewPlaylist: (
			playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">,
		) => Promise<string>;
	};
};

const PlaylistsContext = createContext<PlaylistsContextType | null>(null);

export const PlaylistsProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(playlistsReducer, {
		playlists: [],
		isLoading: true,
		error: null,
	});

	const loadPlaylists = useCallback(async () => {
		dispatch({ type: "LOAD_START" });
		try {
			const playlists = await getAllPlaylists();
			dispatch({ type: "LOAD_SUCCESS", payload: playlists });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao carregar playlists";
			dispatch({ type: "LOAD_ERROR", payload: errorMessage });
			console.error("Error loading playlists:", error);
		}
	}, []);

	useEffect(() => {
		loadPlaylists();
	}, [loadPlaylists]);

	const removePlaylist = useCallback(async (playlistId: string) => {
		try {
			await deletePlaylist(playlistId);
			dispatch({ type: "REMOVE_PLAYLIST", payload: playlistId });
		} catch (error) {
			console.error("Error removing playlist:", error);
			throw error;
		}
	}, []);

	const updatePlaylistData = useCallback(
		async (
			playlistId: string,
			updates: Partial<Omit<Playlist, "id" | "createdAt">>,
		) => {
			try {
				await updatePlaylist(playlistId, updates);
				await loadPlaylists();
			} catch (error) {
				console.error("Error updating playlist:", error);
				throw error;
			}
		},
		[loadPlaylists],
	);

	const createNewPlaylist = useCallback(
		async (
			playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">,
		): Promise<string> => {
			try {
				const playlistId = await createPlaylist(playlist);
				await loadPlaylists();
				return playlistId;
			} catch (error) {
				console.error("Error creating playlist:", error);
				throw error;
			}
		},
		[loadPlaylists],
	);

	return (
		<PlaylistsContext.Provider
			value={{
				state,
				dispatch,
				actions: {
					loadPlaylists,
					removePlaylist,
					updatePlaylistData,
					createNewPlaylist,
				},
			}}
		>
			{children}
		</PlaylistsContext.Provider>
	);
};

export const usePlaylistsContext = () => {
	const context = useContext(PlaylistsContext);
	if (!context) {
		throw new Error(
			"usePlaylistsContext must be used within PlaylistsProvider",
		);
	}
	return context;
};
