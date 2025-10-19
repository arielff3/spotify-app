import { getSpotifyAccessToken } from "@/utils/spotifyAuth";

export const fetchAPI = async (url: string) => {
	const token = await getSpotifyAccessToken();

	const response = await fetch(
		`${import.meta.env.VITE_BASE_SPOTIFY_URL}${url}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.status}`);
	}

	return response.json();
};
