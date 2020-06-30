import React, { Component } from 'react'
import {
    AppBar, Tabs, Tab
} from '@material-ui/core'
import StockAdjusmentForm from './StockAdjusmentForm';
import AllStockAdjustment from './AllStockAdjustment';
import './style.scss'
export default class Sale extends Component {

    constructor(props) {
        super(props);
        const subPage = props.location.pathname;

        let tabIndex = 0;
        switch (subPage) {
            case '/StockAdjustment/AllStockAdjustment':
                tabIndex = 0;
                break;
            case '/StockAdjustment/StockAdjusmentForm':
                tabIndex = 1;
                break;
            default:
                tabIndex = 0;
        }
        this.state = {
            tabIndex,
            tabs: [
                {
                    label: "All Stock Adjustment",
                    // icon: <SupervisorAccount />,
                    chidren: <AllStockAdjustment />
                },
                {
                    label: "Create Stock AdjusmentForm",
                    // icon: <PlusOne />,
                    chidren: <StockAdjusmentForm />
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
            <div className='StockAdjusment-pages'>
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
