import React, {Component} from 'react';
import {withStyles, Button, Card, CardContent, Typography} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import classNames from 'classnames';
import StripeCheckout from 'react-stripe-checkout';
import PaypalExpressBtn from 'react-paypal-express-checkout';

import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';

let env = 'sandbox';
const client = {
    sandbox:    'APP-80W284485P519543T',
    production: 'YOUR-PRODUCTION-APP-ID',
}
const stripeKey= "pk_test_66Gflulvd2qdJtLjHPRAhaFL";

const styles = theme => ({
    header: {
        height        : 600,
        background     : 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color: theme.palette.primary.contrastText
    },
    badge : {
        backgroundColor: theme.palette.error.main,
        color          : theme.palette.getContrastText(theme.palette.error.main)
    },
    ppbtn : {
        width: 150,
        height: 25,
        paddingTop: 2,
        paddingBottom: 2
    }
});

const ppstyle= {
    size: 'small',
    tagline: false,
    label: 'paypal',
    shape: 'rect',
    color: 'blue'
}


class CreditApp extends Component {


     onSuccess = (payment) => {
    
        console.log(payment)
        let pay = {payment: payment}
        this.props.savePayment(pay)
    }

     onCancel = (data) => {
        console.log(data, this.user)
        // return "cancelled payment"
    }

     onError = (err) => {
        console.log("error", err)
        // return "failed payment"
    }

     onToken = (amount, description, name) => {
        console.log(amount, description, name)
        let pay = {payment: {amount: amount, description: description}}
        this.props.savePayment(pay)
    }
    
    render() {
        const {classes} = this.props
        return (
            <div>
            <div className={classNames(classes.header, "flex")}>

                <div className="p-24 w-full max-w-2xl mx-auto">

                    <div className="text-center my-128 mx-24">

                        {/* <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                            <Typography variant="h2" color="inherit" className="font-light">
                                Credit!
                            </Typography>
                        </FuseAnimate>

                        <FuseAnimate duration={400} delay={600}>
                            <Typography variant="subtitle1" color="inherit" className="opacity-75 mt-16 mx-auto max-w-512">
                                You can get credit here
                            </Typography>
                        </FuseAnimate> */}
                    </div>
                </div>
            </div>

            <div className="-mt-192">

                <div className="w-full max-w-2xl mx-auto">

                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                        className="flex items-center justify-center flex-wrap"
                    >

                        <div className="w-full max-w-320 sm:w-1/3 p-12">
                            <Card className="relative">

                                <div className="pt-48 pb-24 text-center">
                                    <Typography variant="subtitle1" color="inherit" className="text-20 font-medium">
                                        SILVER PACKAGE
                                    </Typography>
                                </div>

                                <CardContent className="text-center p-0">

                                    <div className="flex flex-col">
                                        <div className="flex justify-center mb-8">
                                            <Typography variant="h5" color="textSecondary" className="font-medium">$</Typography>
                                            <Typography className="text-56 ml-4 font-light leading-none">4</Typography>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-32">
                                        <Typography variant="subtitle1" className="mb-8">
                                            <span className="font-bold mr-4">10</span>
                                            credits
                                        </Typography>
                                    </div>
                                </CardContent>

                                <div className="flex justify-center pb-16">
                                    <StripeCheckout
                                        stripeKey={stripeKey}
                                        name="Your payment"
                                        ComponentClass="div"
                                        panelLabel="Pay Now"
                                        amount={400}
                                        currency='USD'
                                        billingAddress={true}
                                        shippingAddress={true}
                                        token={this.onToken(400, "")}
                                        zipCode={false}
                                        allowRememberMe
                                        reconfigureOnUpdate={false}
                                        triggerEvent="onClick"
                                    >
                                        <Button variant="contained" color="secondary" className={classNames(classes.ppbtn)}>Stripe</Button>
                                    </StripeCheckout>
                                </div>
                                <div className="flex justify-center pb-32">
                                    <PaypalExpressBtn
                                        env={env}
                                        client={client}
                                        currency="USD"
                                        total={4}
                                        onError={this.onError}
                                        onSuccess={this.onSuccess}
                                        onCancel={this.onCancel}
                                        style={ppstyle}
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="w-full max-w-320 sm:w-1/3 p-12">
                            <Card className="relative" raised>

                                <div className="absolute pin-t pin-x flex justify-center">
                                    <div className={classNames(classes.badge, "py-4 px-8")}>
                                        <Typography variant="caption" color="inherit">BEST VALUE</Typography>
                                    </div>
                                </div>

                                <div className="pt-48 pb-24 text-center">
                                    <Typography variant="subtitle1" color="inherit" className="text-20 font-medium">
                                        GOLD PACKAGE
                                    </Typography>
                                </div>

                                <CardContent className="text-center p-0">

                                    <div className="flex flex-col">
                                        <div className="flex justify-center mb-8">
                                            <Typography variant="h5" color="textSecondary" className="font-medium">$</Typography>
                                            <Typography className="text-56 ml-4 font-light leading-none">29</Typography>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-32">
                                        <Typography variant="subtitle1" className="mb-8">
                                            <span className="font-bold mr-4">500</span>
                                            credits
                                        </Typography>
                                    </div>
                                </CardContent>

                                <div className="flex justify-center pb-16">
                                    <StripeCheckout
                                        stripeKey={stripeKey}
                                        name="Your payment"
                                        ComponentClass="div"
                                        panelLabel="Pay Now"
                                        amount={2900}
                                        currency='USD'
                                        billingAddress={true}
                                        shippingAddress={true}
                                        token={this.onToken(2900, "")}
                                        zipCode={false}
                                        allowRememberMe
                                        reconfigureOnUpdate={false}
                                        triggerEvent="onClick"
                                    >
                                        <Button variant="contained" color="secondary" className={classNames(classes.ppbtn)}>Stripe</Button>
                                    </StripeCheckout>
                                </div>
                                <div className="flex justify-center pb-32">
                                    <PaypalExpressBtn
                                        env={env}
                                        client={client}
                                        currency="USD"
                                        total={29}
                                        onError={this.onError}
                                        onSuccess={this.onSuccess}
                                        onCancel={this.onCancel}
                                        style={ppstyle}
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="w-full max-w-320 sm:w-1/3 p-12">
                            <Card className="relative">

                                <div className="pt-48 pb-24 text-center">
                                    <Typography variant="subtitle1" color="inherit" className="text-20 font-medium">
                                        PLATINUM PACKAGE
                                    </Typography>
                                </div>

                                <CardContent className="text-center p-0">

                                    <div className="flex flex-col">
                                        <div className="flex justify-center mb-8">
                                            <Typography variant="h5" color="textSecondary" className="font-medium">$</Typography>
                                            <Typography className="text-56 ml-4 font-light leading-none">499</Typography>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-32">
                                        <Typography variant="subtitle1" className="mb-8">
                                            <span className="font-bold mr-4">4000</span>
                                            credits
                                        </Typography>
                                    </div>
                                </CardContent>

                                <div className="flex justify-center pb-16">
                                    <StripeCheckout
                                        stripeKey={stripeKey}
                                        name="Your payment"
                                        // description="4000 credits"
                                        ComponentClass="div"
                                        panelLabel="Pay Now"
                                        // amount={userPrice*100}
                                        // currency={appdata.getItem('user').currency.toUpperCase()}
                                        amount={49900}
                                        currency='USD'
                                        // email="info@vidhub.co"
                                        billingAddress={true}
                                        shippingAddress={true}
                                        token={this.onToken(49900, "")}
                                        zipCode={false}
                                        allowRememberMe
                                        reconfigureOnUpdate={false}
                                        triggerEvent="onClick"
                                    >
                                        <Button variant="contained" color="secondary" className={classNames(classes.ppbtn)}>Stripe</Button>
                                    </StripeCheckout>
                                </div>
                                <div className="flex justify-center pb-32">
                                    <PaypalExpressBtn
                                        env={env}
                                        client={client}
                                        currency="USD"
                                        total={499}
                                        onError={this.onError}
                                        onSuccess={this.onSuccess}
                                        onCancel={this.onCancel}
                                        style={ppstyle}
                                    />
                                </div>
                            </Card>
                        </div>
                    </FuseAnimateGroup>

                    {/* <div className="flex flex-col items-center py-96 text-center sm:text-left max-w-xl mx-auto">

                        <Typography variant="h4" className="pb-32 font-light">Frequently Asked Questions</Typography>

                        <div className="flex flex-wrap w-full">

                            <div className="w-full sm:w-1/2 p-24">
                                <Typography className="text-20 mb-8">How does free trial work?</Typography>
                                <Typography className="text-16" color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec augue tincidunt
                                    accumsan. In dignissim laoreet ipsum eu interdum.
                                </Typography>
                            </div>

                            <div className="w-full sm:w-1/2 p-24">
                                <Typography className="text-20 mb-8">Can I cancel any time?</Typography>
                                <Typography className="text-16" color="textSecondary">
                                    Aliquam erat volutpat. Etiam luctus massa ex, at tempus tellus blandit quis. Sed quis neque tellus.
                                    Donec maximus ipsum in malesuada hendrerit.
                                </Typography>
                            </div>

                            <div className="w-full sm:w-1/2 p-24">
                                <Typography className="text-20 mb-8">What happens after my trial ended?</Typography>
                                <Typography className="text-16" color="textSecondary">
                                    Aliquam erat volutpat. Etiam luctus massa ex, at tempus tellus blandit quis. Sed quis neque tellus.
                                    Donec maximus ipsum in malesuada hendrerit.
                                </Typography>
                            </div>

                            <div className="w-full sm:w-1/2 p-24">
                                <Typography className="text-20 mb-8">Can I have a discount?</Typography>
                                <Typography className="text-16" color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec augue tincidunt
                                    accumsan. In dignissim laoreet ipsum eu interdum.
                                </Typography>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        savePayment         : Actions.savePayment
    }, dispatch);
}

function mapStateToProps({CreditApp, auth})
{
    return {
        user              : auth.user
    }
}

// export default withStyles(styles, {withTheme: true})(CreditApp);
export default withReducer('CreditApp', reducer)(withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(CreditApp))));