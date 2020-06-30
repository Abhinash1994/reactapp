import React, { Component } from 'react'
import {
  AppBar, Tabs, Tab
} from '@material-ui/core'
import {
  Work, ViewList
} from '@material-ui/icons'
import Unit from './Unit'
import './style.scss'
import UnitConversion from './UnitConversion'
export default class Sale extends Component {
  state = {
    tabIndex: 0,
    tabs: [
      {
        label: "Create Unit",
        icon: <Work />,
        chidren: <Unit />
      },
      {
        label: "Unit Conversion",
        icon: <ViewList />,
        chidren: <UnitConversion />
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