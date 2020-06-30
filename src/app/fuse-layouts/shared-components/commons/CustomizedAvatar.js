import React from "react";
import { Avatar, withStyles } from "@material-ui/core";

const StyledAvatar = withStyles({
  colorDefault: {
    background: "none"
  }
})(Avatar);

const CustomizedAvatar = props => {
  return <StyledAvatar>{props.children}</StyledAvatar>;
};

export default CustomizedAvatar;
