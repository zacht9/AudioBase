import React, { useState } from "react";
import { Link } from "react-router-dom";
// import * as FaIcons from "react-icons/fa";
// import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import { SidebarData } from "./SidebarData.js";
import "./NavBar.css";
import { IconContext } from "react-icons";

function NavBar() {
  // const [sidebar, setSidebar] = useState(false);
  // const showSidebar = () => setSidebar(!sidebar);

  return (
    <div>
      <IconContext.Provider value={{ color: "#01FF87" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            {/* <FaIcons.FaBars onClick={showSidebar} /> */}
            <MdIcons.MdLibraryMusic />
          </Link>
          <h1 style={{ color: "white", padding: "20px" }}>Spotify Playlist Visualizer</h1>
        </div>
        <nav className="nav-menu active" /* {sidebar ? "nav-menu active" : "nav-menu"} */>
          <ul className="nav-menu-items">
            {/* <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiFillCloseCircle onClick={showSidebar} />
              </Link>
            </li> */}
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.className}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default NavBar;
