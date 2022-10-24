import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    className: "nav-text",
  },
  {
    title: "Account",
    path: "/account",
    icon: <IoIcons.IoIosPaper />,
    className: "nav-text",
  },
  {
    title: "Top Songs",
    path: "/top-songs",
    icon: <BsIcons.BsMusicNote />,
    className: "nav-text",
  },
  {
    title: "Top Artists",
    path: "/top-artists",
    icon: <IoIcons.IoMdPeople />,
    className: "nav-text",
  },
  {
    title: "Top Genres",
    path: "/top-genres",
    icon: <FaIcons.FaRegObjectGroup />,
    className: "nav-text",
  },
  {
    title: "Recently Played",
    path: "/recently-played",
    icon: <IoIcons.IoMdTime />,
    className: "nav-text",
  },
  {
    title: "Playlists",
    path: "/playlists",
    icon: <AiIcons.AiOutlineUnorderedList />,
    className: "nav-text",
  },
];