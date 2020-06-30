import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import Invoice from './Invoice';
import AllInvoices from './AllInvoices';
import './style.scss'
export default class Sale extends Component {

  constructor(props) {
    super(props);
    const subPage = props.location.pathname;

    let tabIndex = 0;
    switch (subPage) {
      case '/Estimate/AllInvoices':
        tabIndex = 0;
        break;
      case '/Estimate/Invoice':
        tabIndex = 1;
        break;
      default:
        tabIndex = 0;
    }
    this.state = {
      tabIndex,
      tabs: [
        {
          label: "All Invoice",
          // icon: <SupervisorAccount />,
          chidren: <AllInvoices />
        },
        {
          label: "Create Invoice",
          // icon: <PlusOne />,
          chidren: <Invoice />
        }
      ]
    }
  }
  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
  };

  render() {
    const { tabIndex, tabs } = this.state
    return (
      <div className='estimate-pages'>
        <AppBar position="static">
          <Tabs
            value={tabIndex}
            onChange={this.handleChange} aria-label="simple tabs example">
            {tabs.map((element, index) => (
              <Tab
                key={index}
                className='text-transform-none'
                icon={element.icon}
                label={element.label} />
            ))}
          </Tabs>
        </AppBar>
        {tabs[tabIndex].chidren}
      </div>
    )
  }
}
