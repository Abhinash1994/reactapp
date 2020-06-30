import React, { Component } from 'react';
import {
  withStyles
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EditVoucher from '../EditVoucher';

const styles = theme => ({
  layoutHeader: {
    [theme.breakpoints.down('md')]: {
    }
  },
});

class JournalVoucher extends Component {

  render() {
    return (
      <div className="p-16 sm:p-24 sale-detail">
        <EditVoucher tran_type="JV"  />
      </div>
    );
  };
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(JournalVoucher));
