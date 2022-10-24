import React from "react";
import { useEffect, useState } from "react";
import "./Homepage.css";
import axios from "axios";

const Homepage = (props) => {

  return (
    <div className="homepage">
      <div className="welcome">
        <b>{"access_token" in localStorage ? (<h3>Hello, {props.userInfo.display_name}!</h3>) : (<h3>Hello!</h3>)}</b>
      </div>
      <br></br>
      {"access_token" in localStorage ? <p></p>: <button type="button" onClick={() => {props.loginFxn();}}>Log In</button>
      }
    </div>
  );
};

export default Homepage;
