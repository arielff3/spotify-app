export interface Playlist {
	id: string;
	name: string;
	notes?: string;
	trackIds: string[];
	createdAt: number;
	updatedAt: number;
}

const DB_NAME = "SpotifyPlaylistsDB";
const DB_VERSION = 1;
const STORE_NAME = "playlists";

const openDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
				objectStore.createIndex("name", "name", { unique: false });
				objectStore.createIndex("createdAt", "createdAt", { unique: false });
			}
		};
	});
};

export const createPlaylist = async (
	playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);

		const id = `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newPlaylist: Playlist = {
			...playlist,
			id,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		const request = store.add(newPlaylist);

		request.onsuccess = () => resolve(id);
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const updatePlaylist = async (
	id: string,
	updates: Partial<Omit<Playlist, "id" | "createdAt">>,
): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const getRequest = store.get(id);

		getRequest.onsuccess = () => {
			const playlist = getRequest.result as Playlist;
			if (!playlist) {
				reject(new Error("Playlist not found"));
				return;
			}

			const updatedPlaylist: Playlist = {
				...playlist,
				...updates,
				updatedAt: Date.now(),
			};

			const putRequest = store.put(updatedPlaylist);
			putRequest.onsuccess = () => resolve();
			putRequest.onerror = () => reject(putRequest.error);
		};

		getRequest.onerror = () => reject(getRequest.error);
		transaction.oncomplete = () => db.close();
	});
};

export const deletePlaylist = async (id: string): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const getPlaylist = async (id: string): Promise<Playlist | null> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(id);

		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const getAllPlaylists = async (): Promise<Playlist[]> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onsuccess = () => {
			const playlists = request.result as Playlist[];
			resolve(playlists.sort((a, b) => b.createdAt - a.createdAt));
		};
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const addTrackToPlaylist = async (
	playlistId: string,
	trackId: string,
): Promise<void> => {
	const playlist = await getPlaylist(playlistId);
	if (!playlist) {
		throw new Error("Playlist not found");
	}

	if (!playlist.trackIds.includes(trackId)) {
		await updatePlaylist(playlistId, {
			trackIds: [...playlist.trackIds, trackId],
		});
	}
};

export const removeTrackFromPlaylist = async (
	playlistId: string,
	trackId: string,
): Promise<void> => {
	const playlist = await getPlaylist(playlistId);
	if (!playlist) {
		throw new Error("Playlist not found");
	}

	await updatePlaylist(playlistId, {
		trackIds: playlist.trackIds.filter((id) => id !== trackId),
	});
};

