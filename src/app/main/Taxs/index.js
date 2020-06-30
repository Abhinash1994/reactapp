import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import {
  Settings, Report
} from '@material-ui/icons'
import Tax from './Tax'
import './style.scss'
import TaxReport from './TaxReport'
export default class TaxTab extends Component {
  state = {
    tabIndex: 0,
    tabs: [
      {
        label: "Tax setup",
        icon: <Settings />,
        chidren: <Tax />
      },
      {
        label: "Tax Report",
        icon: <Report />,
        chidren: <TaxReport />
      },
      // {
      //   label: "Create Invoice",
      //   icon: <PlusOne />,
      //   chidren: <Invoice />
      // },
      // {
      //   label: "All Invoices",
      //   icon: <Payment />,
      //   chidren: <AllInvoices />
      // },
      // {
      //   label: "Sales Report",
      //   icon: <Payment />,
      //   chidren: <SaleReport />
      // },
    ]
  }
  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
  };

  render() {
    const { tabIndex, tabs } = this.state
    return (
      <div className='sales-pages'>
        <AppBar position="static">
          <Tabs
            value={tabIndex}
            onChange={this.handleChange} aria-label="simple tabs example">
            {tabs.map((element, index) => (
              <Tab
                key={index}
                className='text-transform-none'
                label={element.label} />
            ))}
          </Tabs>
        </AppBar>
        {tabs[tabIndex].chidren}
      </div>
    )
  }
}
