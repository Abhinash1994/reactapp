import React, { Component } from 'react';
import { Menus } from '../../../config'
import { Icon, ListItemIcon, ListItemText, Popover, MenuItem, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import AuthRoleService from '../../services/AuthRoleService';


class UserMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userMenu: null,
      menus: [],
      menuList: ["Company", "Branch", "Fiscal Year", "User Role", "Users", "Role Assignment", "Product Group", "Product & Service", "User Log", "Auto Numbering", "Import Data", "Export Data", "Attachment"]
    };
    this.getMenus();
  }
  getMenus = async () => {
    let menus = await AuthRoleService.getUserRole();
    this.setState({ menus })
  }

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
          <Icon>settings</Icon>
        </IconButton>

        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={this.userMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          classes={{
            paper: "py-8"
          }}
        >

          <React.Fragment>
            {this.state.menus.map((element, index) => (
              element.viewRole && Menus.hasOwnProperty(element.menu) && <MenuItem component={Link} to={Menus[element.menu].link} onClick={this.userMenuClose} key={index}>
                <ListItemIcon>
                  <Icon>{Menus[element.menu].icon}</Icon>
                </ListItemIcon>
                <ListItemText className="pl-0" primary={element.menu} />
              </MenuItem>
            ))}
          </React.Fragment>

        </Popover>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: authActions.logoutUser
  }, dispatch);
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
