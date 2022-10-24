import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Account from "./pages/Account";
import TopSongs from "./pages/TopSongs";
import TopArtists from "./pages/TopArtists";
import TopGenres from "./pages/TopGenres";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import Playlists from "./pages/Playlists";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {client_id, client_secret, redirect_uri, home_uri} from "./secrets.js"
import {Buffer} from 'buffer';

/* Important variables for authorization process, derived from secrets.js */
export const base_64 = Buffer.from(client_id + ":" + client_secret).toString('base64');
export const origin = home_uri || "http://localhost:3000";
export const authLink = `https://accounts.spotify.com/authorize?client_id=${encodeURI(client_id)}&response_type=code&redirect_uri=${encodeURI(
  redirect_uri
)}&scope=user-library-read%20playlist-read-private%20user-top-read%20user-read-recently-played&show_dialog=true`;

const App = () => {
  const [authCode, setAuthCode] = useState(
    window.localStorage.getItem("authorization_code") ?? ""
  );
  const [accessToken, setAccessToken] = useState(
    window.localStorage.getItem("access_token") ?? ""
  );
  const [refreshToken, setRefreshToken] = useState(
    window.localStorage.getItem("refresh_token") ?? ""
  );

  const [userInfo, setUserInfo] = useState({
    display_name: "",
    profile_link: "",
    profile_image_link: "",
  });

  /* Runs once the app renders again (happens once we change URL's) */
  useEffect(() => {
    /* authLink redirects to our own app, but the path name will include "authorized", so
    this code will run. */
    if (window.location.href.includes("authorized")) {
      /* Parses out the code parameter from the link we're currently at, saves into 
      authCode variable. */
      let link = window.location.href;
      let startIndex = link.indexOf("?code=") + 6;
      let authorization_code = link.slice(startIndex);
      window.localStorage.setItem("authorization_code", authorization_code);
      setAuthCode(authorization_code);

      getNewTokens(window.localStorage.getItem("authorization_code"));
    }

    if ("access_token" in localStorage) {
      refreshAccessToken();
      getUserInfo();
    }
  }, []);

  /* Handles the user logging into the app. */
  const newLogin = () => {
    window.location.href = authLink; // after this redirect, goes to "authorization" part of useEffect().
  };

  /* Handles the user logging out of the app. */
  const newLogout = () => {
    window.localStorage.clear();
    setAccessToken("");
  };

  /* Gets new access token to make API requests. 'Code' parameter is either authorization code (if we're
  signing in a new user), or a refresh token (if we already have a user and an access token, but the old
  access token expired.) */
  const getNewTokens = () => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", window.localStorage.getItem("authorization_code"));
    // can't just use 'authCode' above because of synchronous issues? as in when we run the app, clear localStorage, then log in again,
    // authCode won't update immediately on line 57? idk, look into it
    params.append("redirect_uri", redirect_uri);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${base_64}`,
      },
    };

    /* POST request to get access token and refresh token */
    axios
      .post("https://accounts.spotify.com/api/token", params, config)
      .then((tokenResponse) => {
        /* After our POST request to the Spotify API, if all was well, we should receive an access token
        and a refresh token. We store these in both localStorage (for future use should the app be closed out but
        the browser still remembers) as well as in the app's state variables accessToken and refreshToken. */

        window.localStorage.setItem(
          "access_token",
          tokenResponse.data.access_token
        );
        window.localStorage.setItem(
          "refresh_token",
          tokenResponse.data.refresh_token
        );
        setAccessToken(tokenResponse.data.access_token);
        setRefreshToken(tokenResponse.data.refresh_token);

        window.location.href = origin + "account/";
      })
      .catch((err) => {
        console.log("Error in getNewTokens() function");
        console.log(err);
      });
  };

  /* If the current access token has expired (happens after 1 hr), use the refresh token (which
  virtually never expires) to obtain a new access token for the web app to use. */
  const refreshAccessToken = (callback, fxn_params) => {
    console.log("refreshing access token now");

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append(
      "refresh_token",
      window.localStorage.getItem("refresh_token")
    );

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${base_64}`,
      },
    };

    axios
      .post("https://accounts.spotify.com/api/token", params, config)
      .then((tokenResponse) => {
        /* After our POST request to the Spotify API, if all was well, we should receive an access token
        and a refresh token. We store these in both localStorage (for future use should the app be closed out but
        the browser still remembers) as well as in the app's state variables accessToken and refreshToken. */
        window.localStorage.setItem(
          "access_token",
          tokenResponse.data.access_token
        );
        setAccessToken(tokenResponse.data.access_token);
        callback.apply(this, fxn_params);
      })
      .catch((err) => {
        console.log("Error in refreshAccessToken() function");
        console.log(err.response.data);
      });
  };

  const getUserInfo = () => {
    /* GET request to get user's profile information, which will be displayed by
        multiple different webpages in the app */
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((tokenResponse) => {
        console.log(tokenResponse.data);
        // must make a new object to pass in to setUserInfo()
        const updatedUserInfo = {
          display_name: tokenResponse.data.display_name,
          profile_link: tokenResponse.data.external_urls.spotify,
          profile_image_link: tokenResponse.data.images[0].url,
        };
        setUserInfo(updatedUserInfo);
      })
      .catch((err) => {
        console.log("Error in getUserInfo() function");
        console.log(err.response);
        if (err.response.data.error.message === "The access token expired") {
          refreshAccessToken(getUserInfo, []);
        }
      });
  };

  return (
    <div>
      <div className="wrapper">
        <div className="header">
          <Header />
        </div>
        <Router>
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main">
            <Routes>
              <Route
                exact
                path="/"
                element={<Homepage loginFxn={newLogin} userInfo={userInfo} />}
              />
              <Route
                path="/account"
                element={
                  <Account
                    loginFxn={newLogin}
                    logoutFxn={newLogout}
                    userInfo={userInfo}
                  />
                }
              />
              <Route
                path="/top-songs"
                element={<TopSongs refreshFxn={refreshAccessToken} />}
              />
              <Route
                path="/top-artists"
                element={<TopArtists refreshFxn={refreshAccessToken} />}
              />
              <Route
                path="/top-genres"
                element={<TopGenres refreshFxn={refreshAccessToken} />}
              />
              <Route
                path="/recently-played"
                element={<RecentlyPlayed refreshFxn={refreshAccessToken} />}
              />
              <Route
                path="/playlists"
                element={<Playlists refreshFxn={refreshAccessToken} />}
              />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
};

export default App;
