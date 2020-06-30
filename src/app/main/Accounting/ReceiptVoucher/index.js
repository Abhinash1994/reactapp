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
    // height: 320,
    // minHeight: 320,
    [theme.breakpoints.down('md')]: {
      // height: 240,
      // minHeight: 240
    }
  },
});

class ReceiptVoucher extends Component {

  render() {
    return (
      <div className="p-16 sm:p-24 sale-detail">
        <EditVoucher tran_type="RV" />
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ReceiptVoucher));
