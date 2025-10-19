export interface SpotifyImage {
	url: string;
	height: number;
	width: number;
}

export interface SpotifyArtist {
	id: string;
	name: string;
	images: SpotifyImage[];
	genres: string[];
	popularity: number;
	followers: {
		total: number;
	};
	external_urls: {
		spotify: string;
	};
}

export interface SpotifyAlbumArtist {
	id: string;
	name: string;
	external_urls: {
		spotify: string;
	};
	href: string;
	type: string;
	uri: string;
}

export interface SpotifyAlbum {
	id: string;
	name: string;
	images: SpotifyImage[];
	album_type: string;
	total_tracks: number;
	release_date: string;
	release_date_precision: string;
	artists: SpotifyAlbumArtist[];
	external_urls: {
		spotify: string;
	};
	href: string;
	type: string;
	uri: string;
}

export interface SpotifyTrack {
	id: string;
	name: string;
	duration_ms: number;
	explicit: boolean;
	preview_url: string | null;
	track_number: number;
	popularity: number;
	album: SpotifyAlbum;
	artists: SpotifyAlbumArtist[];
	external_urls: {
		spotify: string;
	};
}

export interface SpotifyArtistDetails extends SpotifyArtist {
	type: string;
	uri: string;
	href: string;
}

export interface SpotifyArtistAlbumsResponse {
	items: SpotifyAlbum[];
	total: number;
	limit: number;
	offset: number;
	next: string | null;
	previous: string | null;
}

export interface SpotifyArtistTopTracksResponse {
	tracks: SpotifyTrack[];
}

export interface SpotifySearchResponse {
	artists?: {
		items: SpotifyArtist[];
		total: number;
		limit: number;
		offset: number;
		next: string | null;
		previous: string | null;
	};
	albums?: {
		items: SpotifyAlbum[];
		total: number;
		limit: number;
		offset: number;
		next: string | null;
		previous: string | null;
	};
}
