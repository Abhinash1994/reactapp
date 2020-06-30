import React, { Component } from 'react';
import { withStyles, Tab, Tabs } from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import AccountInventoryTab from './tabs/AccountInventoryTab';
import FavouriteTab from './tabs/FavouriteTab';
import ManagementTab from './tabs/ManagementTab';
import SalesTab from './tabs/SalesTab';

const styles = theme => ({
  layoutHeader: {
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down('md')]: {
      height: 240,
      minHeight: 240
    }
  }
});

class LandingPage extends Component {

  state = {
    value: 0,
  };

  componentDidMount() {
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <FusePageSimple

        contentToolbar={
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="off"
            classes={{
              root: "h-64 w-full border-b-1"
            }}
          >
            <Tab
              classes={{
                root: "h-64"
              }} label="Favourite" />
            <Tab
              classes={{
                root: "h-64"
              }}
              label="Account & Inventory" />
            <Tab
              classes={{
                root: "h-64"
              }}
              label="Management Report" />
            <Tab
              classes={{
                root: "h-64"
              }}
              label="sales report" />
          </Tabs>
        }
        content={
          <div className="p-16 sm:p-24">
            {value === 0 && (
              <FavouriteTab />
            )}
            {value === 1 && (
              <AccountInventoryTab />
            )}
            {value === 2 && (
              <ManagementTab />
            )}
            {value === 3 && (
              <SalesTab />
            )}
          </div>
        }
      />
    )
  };
}

export default withStyles(styles, { withTheme: true })(LandingPage);
