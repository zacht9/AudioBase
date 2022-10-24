/**
* Secret variables associated with individual implementations of this Spotify app.
* Includes the client ID, client secret, and redirect URI. They need to be configured at the Spotify Developer Dashboard: https://developer.spotify.com/dashboard/
* The Home URI is not associated with the dashboard, but still needs to be defined here based on how this app runs.
*/

export const client_id = "your-client-id";
export const client_secret = "your-client-secret";
export const redirect_uri = "your-redirect-uri"; // default "http://localhost:3000/authorized"
export const home_uri = "your-home-uri"; // default "http://localhost:3000"