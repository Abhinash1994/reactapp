import React from "react";
import { Card, withStyles } from "@material-ui/core";

const StyledCard = withStyles({
  root: {
    margin: "20px 36px 0"
  }
})(Card);

const CustomizedCard = props => {
  return <StyledCard>{props.children}</StyledCard>;
};

export default CustomizedCard;
