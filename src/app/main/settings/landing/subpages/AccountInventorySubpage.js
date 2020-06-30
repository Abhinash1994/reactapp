import React, { Component } from 'react';
import {
  withStyles
} from '@material-ui/core';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import TrialBalance from './TrialBalance';
import BalanceSheet from './BalanceSheet';
import ProfitAndLoss from './ProfitAndLoss';
import Charkhata from './Charkhata';
import Accountpayable from './Accountpayable';
import Acreceivable from './Acreceivable';
import Ledgerdetails from './Ledgerdetails';
import CashFlow from './CashFlow';
import Sharecapital from './Sharecapital';
import Salarypayable from './Salarypayable';
import productStatement from './productStatement';
import stockValues from './stockValues';
const styles = theme => ({
  layoutHeader: {
    height: 240,
    minHeight: 240,
    [theme.breakpoints.down('md')]: {
      height: 240,
      minHeight: 240
    }
  }
});

class AccountInventorySubpage extends Component {

  render() {
    const path = '/settings/AccountInventory';
    return (
      <>
        <Route path={`${path}/TrialBalance`} component={TrialBalance} />
        <Route path={`${path}/BalanceSheet`} component={BalanceSheet} />
        <Route path={`${path}/ProfitLoss`} component={ProfitAndLoss} />
        <Route path={`${path}/Charkhata`} component={Charkhata} />
        <Route path={`${path}/Acpayable`} component={Accountpayable} />
        <Route path={`${path}/Acreceivable`} component={Acreceivable} />
        <Route path={`${path}/Ledgerdetails`} component={Ledgerdetails} />
        <Route path={`${path}/CashFlow`} component={CashFlow} />
        <Route path={`${path}/Sharecapital`} component={Sharecapital} />
        <Route path={`${path}/Salarypayable`} component={Salarypayable} />
        <Route path={`${path}/productStatement`} component={productStatement} />
        <Route path={`${path}/stockValues`} component={stockValues} />
       
    
      </>
    )
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: authActions.logoutUser
  }, dispatch);
}

function mapStateToProps({ auth, route }) {
  return {
    user: auth.user, route
  }
}
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AccountInventorySubpage));