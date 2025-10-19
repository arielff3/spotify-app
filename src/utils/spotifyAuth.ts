let cachedToken: string | null = null;
let tokenExpiration: number = 0;

export const getSpotifyAccessToken = async (): Promise<string> => {
	if (cachedToken && Date.now() < tokenExpiration) {
		return cachedToken;
	}

	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error("Spotify credentials not configured");
	}

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
		},
		body: "grant_type=client_credentials",
	});

	if (!response.ok) {
		throw new Error("Failed to get Spotify access token");
	}

	const data = await response.json();
	cachedToken = data.access_token;
	tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;

	return cachedToken as string;
};
