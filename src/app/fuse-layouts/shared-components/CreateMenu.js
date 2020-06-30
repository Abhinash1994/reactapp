import React, { Component } from "react";
import {
  IconButton,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";
import * as authActions from "app/auth/store/actions";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

class UserMenu extends Component {
  state = {
    userMenu: null
  };

  userMenuClick = event => {
    this.setState({ userMenu: event.currentTarget });
  };

  userMenuClose = () => {
    this.setState({ userMenu: null });
  };

  render() {
    const { userMenu } = this.state;
    return (
      <React.Fragment>
        <IconButton className="h-64 w-64" onClick={this.userMenuClick}>
          <Icon>add</Icon>
        </IconButton>

        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={this.userMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          classes={{
            paper: "py-4"
          }}
        >
          <React.Fragment>
            <MenuItem component={Link} to="/sales/invoice" onClick={this.userMenuClose}>
              <ListItemIcon>
                <Icon>plus_one</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Invoice" />
            </MenuItem>
            <MenuItem component={Link} to="/chartofaccount" onClick={this.userMenuClose}>
              <ListItemIcon>
                <Icon>card</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Chart Of Account" />
            </MenuItem>
            <MenuItem component={Link} to="/receivePayment">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Receive Payment" />
            </MenuItem>
            <MenuItem component={Link} to="/Estimate">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Estimate" />
            </MenuItem>
            <MenuItem component={Link} to="">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Credit Note" />
            </MenuItem>
             <MenuItem component={Link} to="">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Credit Return" />
            </MenuItem>
            <MenuItem component={Link} to="/newpurchase">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Purchase Order" />
            </MenuItem>
           
            <MenuItem component={Link} to="/StockAdjusment">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Stock Adjustment" />
            </MenuItem>
            <MenuItem component={Link} to="/Statement">
              <ListItemIcon>
                <Icon>panorama_fish_eye</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="Statement" />
            </MenuItem>
          </React.Fragment>
        </Popover>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: authActions.logoutUser
    },
    dispatch
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);
