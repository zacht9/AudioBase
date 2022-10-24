import React from "react";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import "./TooltipText.css";

const TooltipText = (props) => {
    return (
      <Tippy placement="top" content={props.content}>
        <div>{props.text}</div>
      </Tippy>
    );
}

export default TooltipText;