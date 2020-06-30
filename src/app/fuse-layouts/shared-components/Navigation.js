import React from "react";
import { FuseNavigation } from "@fuse";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
// import * as authActions from 'app/auth/store/actions';

const Navigation = ({ navigation, layout, dense, className, user }) => {
  if (user.role === "admin") navigation = navigation[0];
  else if (user.role === "support") navigation = navigation[1];
  else if (user.role === "customer") navigation = navigation[0];
  else navigation = navigation[0];
  return (
    <FuseNavigation
      className={classNames("navigation", className)}
      navigation={navigation}
      layout={layout}
      dense={true}
    />
  );
};

function mapStateToProps({ fuse, auth }) {
  return {
    user: auth.user,
    navigation: fuse.navigation,
  };
}

Navigation.defaultProps = {
  layout: "vertical",
};

export default withRouter(connect(mapStateToProps)(Navigation));
