import React from "react";
import TooltipText from "../components/TooltipText.js";

const TableColumns = [
  {
    Header: "Rank",
    accessor: "num",
  },
  {
    Header: "Name",
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
];

export default TableColumns;
