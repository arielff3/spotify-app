export interface FavoriteTrack {
	id: string;
	name: string;
	artistId: string;
	artistName: string;
	albumName: string;
	albumImage: string;
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
	addedAt: number;
}

const DB_NAME = "SpotifyFavoritesDB";
const DB_VERSION = 1;
const STORE_NAME = "favorites";

const openDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
				objectStore.createIndex("artistId", "artistId", { unique: false });
				objectStore.createIndex("addedAt", "addedAt", { unique: false });
			}
		};
	});
};

export const addFavorite = async (
	track: Omit<FavoriteTrack, "addedAt">,
): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);

		const favoriteTrack: FavoriteTrack = {
			...track,
			addedAt: Date.now(),
		};

		const request = store.add(favoriteTrack);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const removeFavorite = async (trackId: string): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(trackId);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const isFavorite = async (trackId: string): Promise<boolean> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(trackId);

		request.onsuccess = () => resolve(!!request.result);
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const getAllFavorites = async (): Promise<FavoriteTrack[]> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onsuccess = () => {
			const favorites = request.result as FavoriteTrack[];
			resolve(favorites.sort((a, b) => b.addedAt - a.addedAt));
		};
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const getFavoritesByArtist = async (
	artistId: string,
): Promise<FavoriteTrack[]> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index("artistId");
		const request = index.getAll(artistId);

		request.onsuccess = () => {
			const favorites = request.result as FavoriteTrack[];
			resolve(favorites.sort((a, b) => b.addedAt - a.addedAt));
		};
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};

export const clearAllFavorites = async (): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);

		transaction.oncomplete = () => db.close();
	});
};
