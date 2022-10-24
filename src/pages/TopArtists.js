import React from "react";
import { useEffect, useState, useMemo } from "react/cjs/react.development";
import axios from "axios";
import InfoTable from "../components/InfoTable.js";

const TopArtists = (props) => {
  const [topArtistsArray, setTopArtistsArray] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("medium_term");

  useEffect(() => {
    getTopArtists(selectedDuration);
  }, [selectedDuration]);

  const getTopArtists = (time_range) => {
    const config = {
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

    axios
      .get("https://api.spotify.com/v1/me/top/artists", config)
      .then((tokenResponse) => {
        console.log(tokenResponse.data);
        setTopArtistsArray(processData(tokenResponse.data));
      })
      .catch((err) => {
        let errorData = err.response.data.error;
        console.log("Error in getTopArtists() function");
        console.log(err.response.data);
        if (errorData.message === "The access token expired") {
          props.refreshFxn(getTopArtists, [time_range]);
        }
      });
  };

  const processData = (data) => {
    const topArtistsData = [];
    for (let i = 0; i < data.items.length; i++) {
      let element = data.items[i];
      let currentObj = {};
      currentObj["num"] = i + 1;
      currentObj["name"] = element.name;
      currentObj["genres"] = ""; // list of artist genres
      for (let j = 0; j < element.genres.length; j++) {
        let genre = element.genres[j];
        if (j + 1 !== element.genres.length) {
          currentObj["genres"] += genre + ", ";
        } else {
          currentObj["genres"] += genre;
        }
      }

      topArtistsData.push(currentObj);
    }
    //console.log(topArtistsData);
    return topArtistsData;
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "num",
      },
      {
        Header: "Artist Name",
        accessor: "name",
      },
      {
        Header: "Genres",
        accessor: "genres",
      }
    ],
    []
  );

  return (
    <div className="topartists" style={{ textAlign: "center" }}>
      <h3> Your Top Artists </h3>
      <div className="durationRadioButtons" style={{ margin: "auto", fontSize: "24px" }}>
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
      <br></br>
      {!topArtistsArray.length ? (
        <div>
          <p>[Loading table]</p>
        </div>
      ) : (
        <InfoTable data={topArtistsArray} columns={columns} />
      )}
    </div>
  );
};

export default TopArtists;
