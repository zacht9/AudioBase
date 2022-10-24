import React from "react";

const ProfileInfo = (props) => {
  
  let profileLink = props.userInfo.profile_link;
  return (
    <div>
      <img src={props.userInfo.profile_image_link}></img>
      <p> Name: {props.userInfo.display_name} </p>
      <p>
        {" "}
        Profile link: <a href={profileLink}>{profileLink}</a>{" "}
      </p>
    </div>
  );
};

export default ProfileInfo;
