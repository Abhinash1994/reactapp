import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import {
  AttachMoney, List
} from '@material-ui/icons'
import './style.scss'
import EditBudget from './EditBudget';
import ManagerBudget from './ManagerBudget';
export default class SmsPage extends Component {

  constructor(props) {
    super(props);
    const subPage = props.location.pathname;

    let tabIndex = 1;
    switch (subPage) {
      case '/payroll/employee':
        tabIndex = 0;
        break;
      default:
        tabIndex = 0
    }
    this.state = {
      tabIndex,
      tabs: [
        {
          label: "New Budget",
          icon: <AttachMoney />,
          chidren: <EditBudget />
        },
        {
          label: "Budget List",
          icon: <List />,
          chidren: <ManagerBudget />
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
