import React, { Component } from 'react';
import {
  withStyles, DialogContent, Dialog
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EditBudget from '../EditBudget';

const styles = theme => ({
  layoutHeader: {
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down('md')]: {
      height: 240,
      minHeight: 240
    }
  },
});

class BudgetDialog extends Component {

  render() {
    return (
      <Dialog fullScreen className="sale-detail" open={this.props.open}>
        <DialogContent className='content'>
          <EditBudget
            editId={this.props.editId}
            onRemove = {this.props.onRemove}
            editClose={this.props.editClose} />
        </DialogContent>
      </Dialog>
    )
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(BudgetDialog));
