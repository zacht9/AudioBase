import React from "react";
import "./Account.css";
import ProfileInfo from "../components/ProfileInfo.js";

const Account = (props) => {
  return (
    <div className="account">
      <h3> Your Account </h3>
      <br></br>
      <div className="account-info">
        {"access_token" in localStorage ? (
          <ProfileInfo userInfo={props.userInfo} />
        ) : (
          <p>Not logged in yet – log in below.</p>
        )}
      </div>
      <br></br>
      <div className="button">
        {"access_token" in localStorage ? (<button type="button" onClick={() => {props.logoutFxn()}}>Log out</button>) : (<button type="button" onClick={() => {props.loginFxn();}}>Log In</button>)}
      </div>
    </div>
  );
}

export default Account;