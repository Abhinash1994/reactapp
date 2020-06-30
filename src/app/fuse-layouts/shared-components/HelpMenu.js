import React, { Component } from 'react';
import { IconButton, Icon, ListItemIcon, ListItemText, Popover, MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';


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
                    <Icon>contact_support</Icon>
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
                        <MenuItem component={Link} to="">
                            <ListItemIcon>
                                {/* <Icon>panorama_fish_eye</Icon> */}
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Support" />
                        </MenuItem>
                        <MenuItem component={Link} to="">
                            <ListItemIcon>
                                {/* <Icon>panorama_fish_eye</Icon> */}
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Technosys Software & Security Solutions Pvt.Limited" />
                        </MenuItem>
                        <MenuItem component={Link} to="">
                            <ListItemIcon>
                                {/* <Icon>panorama_fish_eye</Icon> */}
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="info@technosys.com.np" />
                        </MenuItem>
                        <MenuItem component={Link} to="">
                            <ListItemIcon>
                                {/* <Icon>panorama_fish_eye</Icon> */}
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="01-5705559" />
                        </MenuItem>
                        <MenuItem component={Link} to="">
                            <ListItemIcon>
                                {/* <Icon>panorama_fish_eye</Icon> */}
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="9851108970-Dipesh Kunwar" />
                        </MenuItem>

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
