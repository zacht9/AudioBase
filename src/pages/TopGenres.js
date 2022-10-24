import React from "react";
import { useEffect, useState, useMemo } from "react/cjs/react.development";
import axios from "axios";
import InfoTable from "../components/InfoTable.js";

const TopGenres = (props) => {

  const [topGenresArray, setTopGenresArray] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("medium_term");
  
  useEffect(() => {
    getTopGenres(selectedDuration);
  }, [selectedDuration]);

  const getTopGenres = (time_range) => {

    {/* Same axios HTTP request as for top artists, because Spotify doesn't have top genres API section, and top genres will be calculated from artists */}
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
        // console.log(tokenResponse.data);
        setTopGenresArray(processData(tokenResponse.data));
      })
      .catch((err) => {
        let errorData = err.response.data.error;
        console.log("Error in getTopGenres() function");
        console.log(err.response.data);
        if (errorData.message === "The access token expired") {
          props.refreshFxn(getTopGenres, []);
        }
      });
  }

  const processData = (data) => {

    /* genreMap: key is genre, value is frequency within top artist list, is unsorted overall */
    let genreMap = new Map();

    for (let i = 0; i < data.items.length; i++) {
      let element = data.items[i];
      for (let j = 0; j < element.genres.length; j++) {
        let currentGenre = element.genres[j];
        if (genreMap.has(currentGenre)) {
          genreMap.set(currentGenre, (genreMap.get(currentGenre) + 1));
        } else {
          genreMap.set(currentGenre, 1);
        }
      }
    }

    let genreArray = Array.from(genreMap, ([genreName, freq]) => ({genreName, freq}));
    // Sorts genres in descending order by frequency
    genreArray.sort((genre1, genre2) => {return (genre2.freq - genre1.freq)});
    genreArray.splice(25);

    // Adding rank attributes to genreArray -- will have to be here as long as I don't know how to
    // get array index from accessor in react-table
    let i = 1;
    for (let genre of genreArray) {
      genre.num = i;
      i++;
    }

    // console.log(genreArray);
    return (genreArray); 
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "num",
      },
      {
        Header: "Genre name",
        accessor: "genreName",
      },
      {
        Header: "Frequency in your top 50 artists",
        accessor: "freq",
      },
    ],
    []
  );

  return (
    <div className="topgenres" style={{textAlign:"center"}}>
      <h3> Your Top Genres </h3>
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
      {!topGenresArray.length ? (
        <div>
          <p>[Loading table]</p>
        </div>
      ) : (
        <InfoTable data={topGenresArray} columns={columns} />
      )}
    </div>
  );
}

export default TopGenres;