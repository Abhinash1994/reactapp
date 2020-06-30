import React, { Component } from 'react'
// import { browserHistory } from 'react-router';
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import './style.scss'
import JournalVoucher from './JournalVoucher'
import PaymentVoucher from './PaymentVoucher'
import ReceiptVoucher from './ReceiptVoucher'
import ContraVoucher from './ContraVoucher'
export default class Accounting extends Component {
  state = {
    tabIndex: 0,
    tabs: [
      {
        label: "Journal Voucher",
        // icon: <SupervisorAccount />,
        chidren: <JournalVoucher />
      },
      {
        label: "Payment Voucher",
        // icon: <Category />,
        chidren: <PaymentVoucher />
      },
      {
        label: "Receipt Voucher",
        // icon: <Receipt />,
        chidren: <ReceiptVoucher />
      },
      {
        label: "Contra Voucher",
        // icon: <ContactSupport />,
        chidren: <ContraVoucher />
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
