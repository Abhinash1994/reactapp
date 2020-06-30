import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import CreateCustomer from './CreateCustomer'
import Invoice from './Invoice';
import AllInvoices from './AllInvoices';
import './style.scss'
import SaleReport from './SaleReport';
export default class Sale extends Component {

  constructor(props) {
    super(props);
    const subPage = props.location.pathname;

    let tabIndex = 0;
    switch (subPage) {
      case '/sales/customer':
        tabIndex = 0;
        break;
      case '/sales/invoice':
        tabIndex = 1;
        break;
      case '/sales/list':
        tabIndex = 2;
        break;
      case '/sales/report':
        tabIndex = 3;
        break;
      default:
        tabIndex = 0;
    }
    this.state = {
      tabIndex,
      tabs: [
        {
          label: "Create Customer",
          // icon: <SupervisorAccount />,
          chidren: <CreateCustomer />
        },
        {
          label: "Create Invoice",
          // icon: <PlusOne />,
          chidren: <Invoice />
        },
        {
          label: "All Invoices",
          // icon: <Payment />,
          chidren: <AllInvoices />
        },
        {
          label: "Sales Report",
          // icon: <Payment />,
          chidren: <SaleReport />
        },
      ]
    }
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
