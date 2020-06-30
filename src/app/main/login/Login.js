import React, { Component } from 'react'
import { withStyles, Card, CardContent, Typography, Divider } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import JWTLoginTab from './tabs/JWTLoginTab';
import Logo from '../../fuse-layouts/shared-components/Logo';

const styles = theme => ({
  root: {
    background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
    color: theme.palette.primary.contrastText
  }
});

class Login extends Component {

  state = {
  };

  handleTabChange = (event, value) => {
    this.setState();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classNames(classes.root, "flex flex-col flex-1  justify-center flex-no-shrink p-40 md:flex-row")}>
        {
          <div className="flex flex-col flex-no-grow items-center text-white p-16 text-center md:p-128 md:items-start md:flex-no-shrink md:flex-1 md:text-left">

            <FuseAnimate animation="transition.expandIn">
              <Logo className='w-128'/>
            </FuseAnimate>

            <FuseAnimate animation="transition.slideUpIn" delay={300}>
              <Typography variant="subtitle1" color="inherit" className="font-light">
                Welcome to Techno Accounting Management System!
                        </Typography>
            </FuseAnimate>

            <FuseAnimate delay={400}>
              <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
                Please Log In With Your Valid User ID & Password.
              </Typography>
            </FuseAnimate>
          </div>
        }

        <FuseAnimate animation={{ translateX: [0, '100%'] }}>
          <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
            <CardContent className="flex flex-col items-center justify-center p-32 md:p-48">
              <Typography variant="h6" className="text-center md:w-full mb-48">LOGIN TO YOUR ACCOUNT</Typography>
              <Divider className="mb-16 w-256" />
              <JWTLoginTab />
              <div className="flex flex-col items-center justify-center pt-32">
                <span className="font-medium text-blue">Do not have an account?</span>
                <Link className="font-medium" to="/register">Create an account</Link>
              </div>

            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Login));
