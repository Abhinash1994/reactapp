import React, { Component } from 'react';
import {
    withStyles, Typography,
} from '@material-ui/core';
import { Payment } from '@material-ui/icons'
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EditStockAdjustment from '../EditStockAdjustment';

const styles = theme => ({
    layoutHeader: {
        // height: 320,
        // minHeight: 320,
        [theme.breakpoints.down('md')]: {
            // height: 240,
            // minHeight: 240
        }
    },
});

class StockAdjusmentForm extends Component {

    render() {
        return (
            <FusePageSimple
                header={
                    <div className="p-6 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <div className="flex items-center">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Payment className="text-32 mr-12" />
                                </FuseAnimate>
                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                    <Typography variant="h6" className="hidden sm:flex">{'Create Invoice'}</Typography>
                                </FuseAnimate>
                            </div>
                        </div>
                    </div>
                }
                content={
                    <div className="p-16 sm:p-24 estimate-detail">
                        <EditStockAdjustment />
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(StockAdjusmentForm));
