import React from "react";
import { useEffect, useState, useMemo } from "react/cjs/react.development";
import axios from "axios";
import TooltipText from "../components/TooltipText.js"
import InfoTable from "../components/InfoTable.js";

const Playlists = (props) => {
  const [userPlaylistArray, setUserPlaylistArray] = useState({});
  const [selectedPlaylistID, setSelectedPlaylistID] = useState("");
  const [selectedPlaylistArray, setSelectedPlaylistArray] = useState([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

  // First useEffect: get a list of the user's playlists from Spotify API via Axios
  useEffect(() => {
    getUserPlaylists();
  }, []);

  useEffect(() => {
    async function setPlaylist() {
      if (selectedPlaylistID !== "") {
        setIsLoadingPlaylist(true);
        setSelectedPlaylistArray(await getPlaylistData(selectedPlaylistID));
        setIsLoadingPlaylist(false);
      }
    }
    setPlaylist();
  }, [selectedPlaylistID]);

  const getUserPlaylists = async () => {
    let numPlaylists = 0;
    let rawPlaylistArray = [];

    // Next requests: get actual playlists from Spotify account
    for (let i = 0; i <= numPlaylists; i += 50) {
      const config = {
        headers: {
          "Authorization":
            "Bearer " + window.localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
        params: {
          "limit": 50,
          "offset": i,
        },
      };

      try {
        const tokenResponse = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          config
        );
        // rawPlaylistArray.push(tokenResponse.data.items);
        if (i == 0) {
          numPlaylists = tokenResponse.data.total; // setting the total number of playlists on the first API request
        }
        let j = i;
        for (let element of tokenResponse.data.items) {
          let currentObj = {};
          currentObj["num"] = j + 1;
          currentObj["name"] = element.name;
          currentObj["id"] = element.id;
          currentObj["length"] = element.tracks.total;
          rawPlaylistArray.push(currentObj);
          j++;
        }
      } catch (err) {
        console.log(err);
        if (err.response.data.message === "The access token expired") {
          console.log("Refresh error in getUserPlaylists() function");
          props.refreshFxn(getUserPlaylists, []);
        }
      }
    }

    setUserPlaylistArray(rawPlaylistArray);
    /* console.log(rawPlaylistArray); */
  };

  const getPlaylistData = async (playlistID) => {

    let length = 0;
    let playlistArray = [];

    for (let i = 0; i <= length; i += 50) {

      //console.log(playlistID);

      const config1 = {
        headers: {
          "Authorization":
            "Bearer " + window.localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
        params: {
          "limit": 50,
          "offset": i,
        },
      };
      
      try {
        const tokenResponse1 = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
          config1
        );

        if (i == 0) {
          length = tokenResponse1.data.total;
        }
        
        //console.log("tokenResponse1");
        console.log(tokenResponse1);

        let song_querystring = "";

        for (let j = 0; j < tokenResponse1.data.items.length; j++) {
          let element = tokenResponse1.data.items[j];
          if (j == 0) {
            song_querystring += element.track.id;
          } else {
            song_querystring += "," + element.track.id;
          }
        }

        const config2 = {
          headers: {
            "Authorization":
              "Bearer " + window.localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          params: {
            "ids": song_querystring,
          },
        };

        const tokenResponse2 = await axios.get(
          "https://api.spotify.com/v1/audio-features",
          config2
        );

        //console.log("tokenResponse2");
        console.log(tokenResponse2);
        
        const pitchNames = [
          "C",
          "C♯/D♭",
          "D",
          "D♯/E♭",
          "E",
          "F",
          "F♯/G♭",
          "G",
          "G♯/A♭",
          "A",
          "A♯/B♭",
          "B",
        ];

        for (let j = 0; j < tokenResponse1.data.items.length; j++) {
          let element = tokenResponse1.data.items[j];
          let element_features = tokenResponse2.data.audio_features[j];
          let currentObj = {};

          currentObj["num"] = i+j+1;
          currentObj["name"] = element.track.name;
          currentObj["date_added"] = element.added_at.replace(/[T|Z]/g, " ");
          currentObj["artists"] = "";

          for (let k = 0; k < element.track.artists.length; k++) {
            let artist = element.track.artists[k];
            if (k + 1 != element.track.artists.length) {
              currentObj["artists"] += artist.name + ", ";
            } else {
              currentObj["artists"] += artist.name;
            }
          }

          currentObj["duration"] = Number(
            (element.track.duration_ms / 60000).toFixed(3)
          ); // song duration
          currentObj["popularity"] = element.track.popularity; // song popularity
          currentObj["tempo"] = element_features.tempo;
          currentObj["key"] = pitchNames[element_features.key];
          currentObj["acousticness"] = element_features.acousticness;
          currentObj["danceability"] = element_features.danceability;
          currentObj["energy"] = element_features.energy;
          currentObj["valence"] = element_features.valence;

          playlistArray.push(currentObj);
        }
      } catch (err) {
        console.log(err.response);
        if (err.response.data.message === "The access token expired") {
          console.log("Refresh error in getPlaylistData() function");
          props.refreshFxn(getPlaylistData, [playlistID]);
        }
      }
    }
    console.log(playlistArray);
    return playlistArray;
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "num",
      },
      {
        Header: "Song name",
        accessor: "name",
      },
      {
        Header: "Artists",
        accessor: "artists",
      },
      {
        Header: () => {
          return (
            <TooltipText
              content="When the author added the song to the playlist."
              text="Date added (UTC)"
            />
          );
        },
        accessor: "date_added",
      },
      {
        Header: () => {
          return (
            <TooltipText
              content="Duration of the song in minutes."
              text="Duration"
            />
          );
        },
        accessor: "duration",
        sortType: (rowA, rowB) => {
          let elementA = Number(rowA.values["duration"]);
          let elementB = Number(rowB.values["duration"]);
          if (elementA > elementB) {
            return -1;
          } else if (elementB < elementA) {
            return 1;
          } else {
            return 0;
          }
        },
      },
      {
        Header: () => {
          return (
            <TooltipText
              content="Spotify's 0-100 rating of how popular the song is, 100 being most popular. Ratings of 0 often occur because Spotify moves song IDs, and this is often not updated in user playlists."
              text="Popularity"
            />
          );
        },
        accessor: "popularity",
      },
      {
        Header: () => {
          return (
            <TooltipText
              content="The song's tempo in BPM, calculated by Spotify's AI."
              text="Tempo"
            />
          );
        },
        accessor: "tempo",
      },
      {
        Header: () => {
          return (
            <TooltipText
              content="The song's average pitch, calculated by Spotify's AI."
              text="Key"
            />
          );
        },
        accessor: "key",
      },
      {
        Header: () => {
          return (
            <TooltipText
              content='From Spotify: "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."'
              text="Acousticness"
            />
          );
        },
        accessor: "acousticness",
        sortType: (rowA, rowB) => {
          let elementA = Number(rowA.values["acousticness"]);
          let elementB = Number(rowB.values["acousticness"]);
          if (elementA > elementB) {
            return -1;
          } else if (elementB < elementA) {
            return 1;
          } else {
            return 0;
          }
        },
      },
      {
        Header: () => {
          return (
            <TooltipText
              content='From Spotify: "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable."'
              text="Danceability"
            />
          );
        },
        accessor: "danceability",
        sortType: (rowA, rowB) => {
          let elementA = Number(rowA.values["danceability"]);
          let elementB = Number(rowB.values["danceability"]);
          if (elementA > elementB) {
            return -1;
          } else if (elementB < elementA) {
            return 1;
          } else {
            return 0;
          }
        },
      },
      {
        Header: () => {
          return (
            <TooltipText
              content='From Spotify: "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy."'
              text="Energy"
            />
          );
        },
        accessor: "energy",
        sortType: (rowA, rowB) => {
          let elementA = Number(rowA.values["energy"]);
          let elementB = Number(rowB.values["energy"]);
          if (elementA > elementB) {
            return -1;
          } else if (elementB < elementA) {
            return 1;
          } else {
            return 0;
          }
        },
      },
      {
        Header: () => {
          return (
            <TooltipText
              content='From Spotify: "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."'
              text="Happiness"
            />
          );
        },
        accessor: "valence",
        sortType: (rowA, rowB) => {
          let elementA = Number(rowA.values["valence"]);
          let elementB = Number(rowB.values["valence"]);
          if (elementA > elementB) {
            return -1;
          } else if (elementB < elementA) {
            return 1;
          } else {
            return 0;
          }
        },
      },
    ],
    []
  );

  const handlePlaylistChange = (e) => {
    //console.log(e.target.value);
    setSelectedPlaylistID(e.target.value);
  };

  return (
    <div className="topsongs" style={{ textAlign: "center" }}>
      <h3> Your Saved Playlists </h3>
      {!userPlaylistArray.length ? (
        <div>
          <p>[Loading playlists]</p>
        </div>
      ) : (
        <select
          onChange={handlePlaylistChange}
          style={{ fontFamily: "Segoe UI", fontSize: "14px" }}
          disabled={isLoadingPlaylist}
        >
          <option>Select a playlist.</option>
          {userPlaylistArray.map((playlist) => (
            <option value={playlist.id}>
              {playlist.num + ". " + playlist.name}
            </option>
          ))}
        </select>
      )}
      <br></br>
      {!selectedPlaylistArray.length ? (
        isLoadingPlaylist ? (
          <div>
            <p>Loading playlist...</p>
          </div>
        ) : (
          <div>
            <p></p>
          </div>
        )
      ) : isLoadingPlaylist ? (
        <div>
          <p>Loading playlist...</p>
        </div>
      ) : (
        <div>
          <InfoTable data={selectedPlaylistArray} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default Playlists;
