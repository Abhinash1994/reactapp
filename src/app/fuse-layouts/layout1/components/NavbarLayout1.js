import React from "react";
import { AppBar, Hidden, Icon, withStyles } from "@material-ui/core";
import { FuseScrollbars } from "@fuse";
import classNames from "classnames";
import Logo from "app/fuse-layouts/shared-components/Logo";
import NavbarFoldedToggleButton from "app/fuse-layouts/shared-components/NavbarFoldedToggleButton";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import Navigation from "app/fuse-layouts/shared-components/Navigation";

const styles = (theme) => ({
  content: {
    overflowX: "hidden",
    overflowY: "auto",
    "-webkit-overflow-scrolling": "touch",
    background:
      "linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 30%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "90% 30px, 90% 8px",
    backgroundAttachment: "local, scroll",
  },
});

const NavbarLayout1 = ({ classes, navigation, className }) => {
  return (
    <div
      className={classNames("flex flex-col overflow-hidden h-full", className)}
    >
      <AppBar
        color="primary"
        position="static"
        elevation={0}
        className="flex flex-row items-center flex-shrink h-64 min-h-64 nav-header"
      >
        <div className="flex flex-1 pr-8 pl-16 items-center justify-center">
          <Logo className="logo-icon" />
        </div>

        <Hidden mdDown>
          <NavbarFoldedToggleButton />
        </Hidden>

        <Hidden lgUp>
          <NavbarMobileToggleButton>
            <Icon>close</Icon>
          </NavbarMobileToggleButton>
        </Hidden>
      </AppBar>

      <FuseScrollbars className={classNames(classes.content)}>
        {/* <UserNavbarHeader /> */}

        <Navigation layout="vertical" />
      </FuseScrollbars>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(NavbarLayout1);
