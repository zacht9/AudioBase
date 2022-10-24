import React from "react";
import { useMemo, useEffect, useState } from "react/cjs/react.development";
import axios from "axios";
import InfoTable from "../components/InfoTable.js";
import TooltipText from "../components/TooltipText.js";

const RecentlyPlayed = (props) => {
  const [recentlyPlayedArray, setRecentlyPlayedArray] = useState([]);

  useEffect(() => {
    getRecentlyPlayed();
  }, []);

  const getRecentlyPlayed = () => {
    const config = {
      headers: {
        "Authorization":
          "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      params: {
        "limit": 50,
      },
    };

    let song_querystring = "";

    axios
      .get("https://api.spotify.com/v1/me/player/recently-played", config)
      .then((tokenResponse1) => {
        console.log(tokenResponse1.data);

        for (let i = 0; i < tokenResponse1.data.items.length; i++) {
          let element = tokenResponse1.data.items[i];
          if (i == 0) {
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

         axios
           .get("https://api.spotify.com/v1/audio-features", config2)
           .then((tokenResponse2) => {
             // console.log("TOKEN RESPONSE 2 DATA");
             // console.log(tokenResponse2.data);
             setRecentlyPlayedArray(
               processData(tokenResponse1.data, tokenResponse2.data)
             );
           })
           .catch((error) => {
             console.log(error);
             if (error.response.data.message === "The access token expired") {
               console.log(
                 "Refresh error in getTopSongsInfo() function, 2nd req"
               );
               props.refreshFxn(getRecentlyPlayed, []);
             }
           });
      })
      .catch((err) => {
        let errorData = err.response.data.error;
        console.log("Error in getRecentlyPlayed() function");
        console.log(err.response.data);
        if (errorData.message === "The access token expired") {
          console.log("Refreshing now though");
          props.refreshFxn(getRecentlyPlayed, []);
        }
      });
  };

  const processData = (tracklist, trackFeatures) => {
    const recentlyPlayedData = [];
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
    for (let i = 0; i < tracklist.items.length; i++) {
      let element = tracklist.items[i];
      let element_features = trackFeatures.audio_features[i];
      let currentObj = {};
      currentObj["num"] = i + 1;
      currentObj["name"] = element.track.name;

      currentObj["timestamp"] = element.played_at.replace(/[T|Z]/g, " ");

      currentObj["artists"] = "";
      for (let j = 0; j < element.track.artists.length; j++) {
        let artist = element.track.artists[j];
        if (j + 1 != element.track.artists.length) {
          currentObj["artists"] += artist.name + ", ";
        } else {
          currentObj["artists"] += artist.name;
        }
      }

      currentObj["duration"] = Number((element.track.duration_ms / 60000).toFixed(3)); // song duration
      currentObj["popularity"] = element.track.popularity; // song popularity

      currentObj["tempo"] = element_features.tempo;

      // Spotify returns an integer 0-11 for the key (pitch class notation) -- just maps this integer to a string
      currentObj["key"] = pitchNames[element_features.key];
      currentObj["acousticness"] = element_features.acousticness;
      currentObj["danceability"] = element_features.danceability;
      currentObj["energy"] = element_features.energy;
      currentObj["valence"] = element_features.valence;

      recentlyPlayedData.push(currentObj);
    }
    //console.log(recentlyPlayedData);
    return recentlyPlayedData;
  };

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
        Header: "Time listened (UTC)",
        accessor: "timestamp",
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

  return (
    <div className="recentlyplayed" style={{textAlign:"center"}}>
      <h3> Your Recently Played Songs </h3>
      <br></br>
      {/* Necessary because axios might not return API data right away; need loading sign in the meantime, otherwise error happens */}
      {!recentlyPlayedArray.length ? (
        <div>
          <p>[Loading table]</p>
        </div>
      ) : (
        <InfoTable data={recentlyPlayedArray} columns={columns} />
      )}
    </div>
  );
};

export default RecentlyPlayed;
