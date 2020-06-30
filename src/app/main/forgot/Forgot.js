import React, {Component} from 'react'
import {withStyles, Card, CardContent, Typography, TextField, Button} from '@material-ui/core';
import {darken} from '@material-ui/core/styles/colorManipulator';
import {FuseAnimate} from '@fuse';
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';
import {Link, withRouter} from 'react-router-dom';
import * as authActions from 'app/auth/store/actions';
import classNames from 'classnames';
// import _ from '@lodash';
// import JWTLoginTab from './tabs/JWTLoginTab';

const styles = theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color     : theme.palette.primary.contrastText
    }
});

class Forgot extends Component {

    state = {
        email: ''
    };

    handleChange = name => event => {
        var cursor = this.state;
        cursor[name] = event.target.value;
        this.setState({
            state: cursor,
        });
    };

    canBeSubmitted()
    {
        const {email} = this.state;
        return (
            email.length > 0
        );
    }

    forgotPassword = () => {
        var email = this.state.state
        this.props.forgot(email);
    }

    render()
    {
        const {classes} = this.props;
        const {email} = this.state;
        return (
            <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24 md:flex-row md:p-0")}>

                <div className="flex flex-col flex-no-grow items-center text-white p-16 text-center md:p-128 md:items-start md:flex-no-shrink md:flex-1 md:text-left">

                    <FuseAnimate animation="transition.expandIn">
                        <img className="w-128 mb-32" src="assets/images/logos/bird-logo.png" alt="logo"/>
                    </FuseAnimate>

                    <FuseAnimate animation="transition.slideUpIn" delay={300}>
                        <Typography variant="h3" color="inherit" className="font-light">
                            Welcome to the Friendealer Admin Panel!
                        </Typography>
                    </FuseAnimate>

                    <FuseAnimate delay={400}>
                        <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel convallis elit fermentum pellentesque. Sed mollis velit
                            facilisis facilisis.
                        </Typography>
                    </FuseAnimate>
                </div>

                <FuseAnimate animation={{translateX: [0, '100%']}}>

                    <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>

                        <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">

                            <Typography variant="h6" className="md:w-full mb-32">RECOVER YOUR PASSWORD</Typography>
         
                                <TextField
                                    className="mb-16"
                                    label="Email"
                                    autoFocus
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange('email')}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className="w-224 mx-auto mt-16"
                                    aria-label="Reset"
                                    disabled={!this.canBeSubmitted()}
                                    onClick={this.forgotPassword}
                                >
                                    SEND RESET LINK
                                </Button>

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <Link className="font-medium" to="/login">Go back to login</Link>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        forgot: authActions.forgot
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        login: auth.login,
        user : auth.user
    }
}

// export default withStyles(styles, {withTheme: true})(withRouter(Forgot));
export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Forgot)));
