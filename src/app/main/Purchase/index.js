import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import {
  SupervisorAccount, Payment, PlusOne
} from '@material-ui/icons'
import CreateSupplier from './CreateSupplier'
import PurchasePage from './Purchase';
import PurchaseList from './AllPurchases';
import './style.scss'
import PurchaseReport from './PurchaseReport';
export default class Purchase extends Component {
  state = {
    tabIndex: 1,
    tabs: [
      {
        label: "Create Supplier",
        icon: <SupervisorAccount />,
        chidren: <CreateSupplier />
      },
      {
        label: "Create Purchase",
        icon: <PlusOne />,
        chidren: <PurchasePage />
      },
      {
        label: "All Purchases",
        icon: <Payment />,
        chidren: <PurchaseList />
      },
      {
        label: "Purchases Report",
        icon: <Payment />,
        chidren: <PurchaseReport />
      },
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
