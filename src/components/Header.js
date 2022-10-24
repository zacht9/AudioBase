import React from "react";
import * as MdIcons from "react-icons/md";
import "./Header.css";
import { IconContext } from "react-icons";

function header() {
  return (
    <div style={{'display': 'flex', 'alignItems': 'center'}}>
      <IconContext.Provider value={{ color: "#01FF87" }}>
        <MdIcons.MdLibraryMusic className="logo" />
        <h1>AudioBase</h1>
      </IconContext.Provider>
    </div>
  );
}

export default header;
