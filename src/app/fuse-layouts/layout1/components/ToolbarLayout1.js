import React from "react";
import {
  AppBar,
  Hidden,
  MuiThemeProvider,
  Toolbar,
  withStyles,
} from "@material-ui/core";
import { FuseSearch } from "@fuse";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import CreateMenu from "app/fuse-layouts/shared-components/CreateMenu";
import SettingMenu from "app/fuse-layouts/shared-components/SettingMenu";
import HelpMenu from "../../shared-components/HelpMenu";

const styles = (theme) => ({
  separator: {
    width: 1,
    height: 32,
    backgroundColor: theme.palette.divider,
  },
});

const ToolbarLayout1 = ({ classes, settings, toolbarTheme, setting }) => {
  const layoutConfig = settings.layout.config;

  return (
    <MuiThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className="flex relative z-10 h-64"
        color="default"
        style={{ minHeight: "32px" }}
      >
        <Toolbar className="px-4 h-64 top-header" style={{ minHeight: "32px" }}>
          {layoutConfig.navbar.display &&
            layoutConfig.navbar.position === "left" && (
              <Hidden lgUp>
                <NavbarMobileToggleButton />
                <div className={classes.separator} />
              </Hidden>
            )}

          <div className="flex flex-1 text-16">{setting.company.name}</div>

          <div className="flex items-center">
            <CreateMenu />
            <FuseSearch />
            <SettingMenu />
            <HelpMenu />
            <UserMenu />

            <div className={classes.separator} />
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

function mapStateToProps({ fuse, setting }) {
  return {
    settings: fuse.settings.current,
    toolbarTheme: fuse.settings.toolbarTheme,
    setting,
  };
}

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(ToolbarLayout1))
);
