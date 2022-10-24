import React from "react";
import { NavLink } from "react-router-dom";
// import * as FaIcons from "react-icons/fa";
// import * as AiIcons from "react-icons/ai";
// import * as MdIcons from "react-icons/md";
import { SidebarData } from "./SidebarData.js";
import "./Sidebar.css";
import { IconContext } from "react-icons";

export default function Sidebar() {
  /*
  getCurrPageNum(title) {
    switch (title) {
      case "Home":
        return 1;
      case "Account":
        return 2;
      case "Top Songs":
        return 3;
      case "Top Artists":
        return 4;
      case "Top Genres":
        return 5;
      case "Recently Played":
        return 6;
      case "Playlist":
        return 7;
      default:
        return 0;
    }
  }
  */

  /*
  seeIfCurrentLink(item) {
    let currentLink = window.location.href
    let startIndex = currentLink.indexOf("3000") + 4;
    let pageUrl = currentLink.slice(startIndex);
    if (pageUrl === item.path) {
        return "nav-text highlighted";
    } else {
        return "nav-text";
    }
  }
  */
  /*
  determineLinkClass(item) {
    if (item.path === this.props.highlightedLink) {
        console.log("determineLinkClass() returned highlighted");
        return "nav-text highlighted";
    } else {
        console.log("determineLinkClass() returned normal");
        return "nav-text";
    }
  }
  */

  /*
  const determineIfHighlighted= (item) => {
    let currentLink = window.location.href;
    let startIndex = currentLink.indexOf("3000") + 4;
    let pageUrl = currentLink.slice(startIndex);
    if (pageUrl === item.path) {
        // console.log("Highlighted");
        return "highlighted";
    } else {
        // console.log("Not highlighted");
        return "default";
    }
  }
  */

  return (
    <div>
      <IconContext.Provider value={{ color: "#01FF87" }}>
        <nav className="nav-menu">
          <ul className="nav-menu-items">
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.className}>
                  <NavLink to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}
