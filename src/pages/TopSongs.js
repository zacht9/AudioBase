import React from "react";
import { useEffect, useState, useMemo } from "react/cjs/react.development";
import axios from "axios";
import InfoTable from "../components/InfoTable.js";
import TableColumns from "../components/TableColumns.js";

const TopSongs = (props) => {
  const [trackSummary, setTrackSummary] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("medium_term");

  useEffect(() => {
    getTrackInfo(selectedDuration);
  }, [selectedDuration]);

  const getTrackInfo = (time_range) => {
    const config1 = {
      headers: {
        "Authorization":
          "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      params: {
        "limit": 50,
        "time_range": time_range,
      },
    };

    let song_querystring = "";

    axios
      .get("https://api.spotify.com/v1/me/top/tracks", config1)
      .then((tokenResponse1) => {
        // console.log("TOKEN RESPONSE 1 DATA");
        // console.log(tokenResponse1.data);

        // Putting all of the songs' id's in a querystring, later used to make a request from
        // the Spotify API for the tracks' metrics
        for (let i = 0; i < tokenResponse1.data.items.length; i++) {
          let element = tokenResponse1.data.items[i];
          if (i == 0) {
            song_querystring += element.id;
          } else {
            song_querystring += "," + element.id;
          }
        }

        // console.log("querystring: " + song_querystring);

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
            setTrackSummary(
              processData(tokenResponse1.data, tokenResponse2.data)
            );
          })
          .catch((error) => {
            console.log(error);
            if (error.response.data.message === "The access token expired") {
              console.log(
                "Refresh error in getTopSongsInfo() function, 2nd req"
              );
              props.refreshFxn(getTrackInfo, [time_range]);
            }
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "The access token expired") {
          console.log("Refresh error in getTopSongsInfo() function, 1st req");
          props.refreshFxn(getTrackInfo, [time_range]);
        }
      });
  };

  const processData = (tracklist, trackFeatures) => {
    const topSongsData = [];
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

      currentObj["num"] = i + 1; // song numbering
      currentObj["name"] = element.name; // song name

      currentObj["artists"] = ""; // list of song artists
      for (let j = 0; j < element.artists.length; j++) {
        let artist = element.artists[j];
        if (j + 1 !== element.artists.length) {
          currentObj["artists"] += artist.name + ", ";
        } else {
          currentObj["artists"] += artist.name;
        }
      }

      currentObj["duration"] = Number((element.duration_ms / 60000).toFixed(3)); // song duration
      currentObj["popularity"] = element.popularity; // song popularity

      currentObj["tempo"] = element_features.tempo;
      currentObj["key"] = pitchNames[element_features.key];
      currentObj["acousticness"] = element_features.acousticness;
      currentObj["danceability"] = element_features.danceability;
      currentObj["energy"] = element_features.energy;
      currentObj["valence"] = element_features.valence;

      topSongsData.push(currentObj);
    }

    console.log(topSongsData);
    return topSongsData;
  };
  
  const columns = useMemo(
    () => TableColumns,
    []
  );

  return (
    <div className="topsongs" style={{ textAlign: "center" }}>
      <h3> Your Top Songs </h3>
      <div
        className="durationRadioButtons"
        style={{ margin: "auto", fontSize: "24px" }}
      >
        <input
          type="radio"
          name="react-radio-btn"
          value="short"
          onChange={() => {
            setSelectedDuration("short_term");
          }}
        />
        Past 4 weeks
        <input
          type="radio"
          name="react-radio-btn"
          value="medium"
          defaultChecked="true"
          onChange={() => {
            setSelectedDuration("medium_term");
          }}
        />
        Past 6 months
        <input
          type="radio"
          name="react-radio-btn"
          value="long"
          onChange={() => {
            setSelectedDuration("long_term");
          }}
        />
        All time
      </div>
      {/*<select style={{fontFamily: "Segoe UI"}}>
        <option selected value="A">Table</option>
        <option value="B">Chart1</option>
        <option value="C">Chart2</option>
      </select>*/}
      <br></br>
      {!trackSummary.length ? (
        <div>
          <p>[Loading table]</p>
        </div>
      ) : (
        <>
          {/*}
          <ReactTooltip
            place="top"
            type="info"
            effect="solid"
            multiline={true}
            left="0"
          /> */}
          <InfoTable data={trackSummary} columns={columns} />
        </>
      )}
    </div>
  );
};

export default TopSongs;
