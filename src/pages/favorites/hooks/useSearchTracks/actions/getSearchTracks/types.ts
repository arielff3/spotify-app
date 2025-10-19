export interface SpotifyTrackSearchResult {
	id: string;
	name: string;
	artists: Array<{ id: string; name: string }>;
	album: {
		id: string;
		name: string;
		images: Array<{ url: string }>;
	};
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
}