import React, { Component } from 'react';
import {
  Typography, Button, Checkbox, Paper, Grid
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import { Settings } from '@material-ui/icons';

class SmsSetting extends Component {

  state = {
    settings: {
      sales_order: false,
      salary_slip: false,
      salary_payment: false,
      receive_payment: false,
    }
  };

  async componentDidMount() {
  }

  handleSettingsChange = name => event => {
    this.setState({
      settings: {
        ...this.state.settings,
        [name]: event.target.checked
      }
    })
  }

  render() {
    const { settings } = this.state;
    const listClass = 'flex justify-between items-center mb-32';
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Settings className="text-32 mr-12" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'SMS Settings'}</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper style={{ padding: '1em' }}>
              <Grid container>
                <Grid item xs={12} sm={6} className='sms-background'>
                </Grid>
                <Grid item xs={12} sm={6} className='p-12'>
                  <Grid container>
                    <Grid item xs={12} className={listClass}>
                      <Typography className='text-24'>Sales Order</Typography>
                      <Checkbox
                        checked={settings.sales_order}
                        onChange={this.handleSettingsChange('sales_order')}
                      />
                    </Grid>
                    <Grid item xs={12} className={listClass}>
                      <Typography className='text-24'>Salary Slip</Typography>
                      <Checkbox
                        checked={settings.salary_slip}
                        onChange={this.handleSettingsChange('salary_slip')}
                      />
                    </Grid>
                    <Grid item xs={12} className={listClass}>
                      <Typography className='text-24'>Salary Payment</Typography>
                      <Checkbox
                        checked={settings.salary_payment}
                        onChange={this.handleSettingsChange('salary_payment')}
                      />
                    </Grid>
                    <Grid item xs={12} className={listClass}>
                      <Typography className='text-24'>Receive payment</Typography>
                      <Checkbox
                        checked={settings.receive_payment}
                        onChange={this.handleSettingsChange('receive_payment')}
                      />
                    </Grid>
                    <Grid item xs={12} className='flex justify-end'>
                      <Button variant='contained' color='primary'>Save</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </div>
        }
      />
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
export default connect(mapStateToProps, mapDispatchToProps)(SmsSetting);
