import React from "react";
import { Button, withStyles } from "@material-ui/core";

const StyledButton = withStyles({
  root: {
    textTransform: "none"
  }
})(Button);

const CustomizedButton = props => {
  return <StyledButton>{props.children}</StyledButton>;
};

export default CustomizedButton;
