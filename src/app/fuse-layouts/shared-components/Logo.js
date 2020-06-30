import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { API_URL } from '../../../config';

const styles = theme => ({
  root: {
    '& .logo-icon': {
      width: 50,
      height: 50,
      transition: theme.transitions.create(['width', 'height'], {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut
      })
    }
  },
  reactBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#61dafb'
  }
});

function Logo({ classes, user, setting, className, showTitle }) {
  return (
    <div className={classNames(classes.root, "flex items-center")}>
      <img
        className={className}
        src={setting.company.logo
          ? `${API_URL}/asset${setting.company.logo}`
          : "assets/images/logos/bird-logo.png"}
        alt="logo" />
      {showTitle && <Typography className="text-24 ml-8 logo-text">{setting.company.name}</Typography>}
    </div>
  );
}

function mapStateToProps({ auth, setting }) {
  return {
    user: auth.user,
    setting
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps)(Logo)));
// export default withStyles(styles, {withTheme: true})(Logo);
