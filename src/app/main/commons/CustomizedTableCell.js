import React from "react";
import { TableCell, withStyles } from "@material-ui/core";

const StyledTableCell = withStyles({
  head: {
    fontSize: "17px"
  },
  root: {
    padding: 0,
    textAlign: "center"
  }
})(TableCell);

const CustomizedTableCell = props => {
  return <StyledTableCell>{props.children}</StyledTableCell>;
};

export default CustomizedTableCell;
