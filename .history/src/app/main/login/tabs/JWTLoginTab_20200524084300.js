import React, { Component } from 'react';
import { Button, Divider, FormControl, FormControlLabel, Checkbox, InputAdornment, Icon, withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as authActions from 'app/auth/store/actions';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import {
  getAllBranch
} from '../../../store/actions'
const styles = theme => ({
  login_button: {
    background: 'linear-gradient(to bottom,#139ff0 0,#0087e0 100%)',
    border: '1px solid #0087e0',
    color: '#F7F7F7',
    textShadow: '0 -1px transparent'
  }
})

class JWTLoginTab extends Component {
  componentDidMount() {
    this.props.getAllBranch();
    // api.post('http://127.0.0.1:8000/api/allbranches/', {})
    //     .then(res => {
    //         console.log("--------------------------" + JSON.stringify(this.props.match.params))
    //         console.log(JSON.stringify(res.data.branch))
    //         this.setState({ rows: res.data.branch });
    //         api.get('http://127.0.0.1:8000/api/allfiscalyear/', {})
    //             .then(res => {
    //                 console.log("--------------------------" + JSON.stringify(this.props.match.params))
    //                 console.log(JSON.stringify(res.data.branch))
    //                 this.setState({ fiscals: res.data.fiscalyear });
    //             });
    //     });
  }
  state = {
    canSubmit: false,
    email: '',
    password: '',
    remember: true,
    branch: '',
    rows: [],
    fiscals: [],
  };

  handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
  };

  form = React.createRef();

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  onSubmit = (model) => {
    model.id = this.state.branch;
    this.props.submitLogin(model);
  };
  handleChange = (event) => {
    var cursor = event.target.value;
    this.setState({
      date: cursor,
    });
  }
  handleChanges = (event) => {
    var cursor = event.target.value;
    this.setState({
      branch: cursor,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.login.error && (this.props.login.error.email || this.props.login.error.password)) {
      this.form.updateInputsWithError({
        ...this.props.login.error
      });

      this.props.login.error = null;
      this.disableButton();
    }

    return null;
  }

  render() {
    const { classes, branch } = this.props;
    const { remember } = this.state;
    return (
      <div className="w-full">
        <Formsy
          onValidSubmit={this.onSubmit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          ref={(form) => this.form = form}
          className="flex flex-col justify-center w-full"
        >
          <Select
            className="mb-24"
            value={this.state.branch || ''}
            onChange={this.handleChanges}
            name="branch"
            required
            input={<OutlinedInput name="branch" id="branch" labelWidth={0} />}
          >
            <MenuItem value="">
              <em>Select Branch</em>
            </MenuItem>
            {
              branch.branchs.map((item, index) => (
                <MenuItem key={index} value={item.id || ''}>{item.branch_Name}</MenuItem>
              ))
            }
          </Select>

          <TextFieldFormsy
            className="mb-16"
            type="text"
            name="email"
            label="Username/Email"
            validations={{
              minLength: 4,
            }}
            validationErrors={{
              minLength: 'Min character length is 4'
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
            }}
            variant="outlined"
            required
          />

          <TextFieldFormsy
            className="mb-16"
            type="password"
            name="password"
            label="Password"
            validations={{
              minLength: 4
            }}
            validationErrors={{
              minLength: 'Min character length is 4'
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
            }}
            variant="outlined"
            required
          />
          <div className="flex items-center justify-between">

            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={remember}
                    onChange={this.handleChange} />
                }
                label="Remember Me"
              />
            </FormControl>

            <Link className="font-medium" to="/forgot">
              {'Forgot Password?'}
            </Link>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.login_button + " w-full mx-auto mt-16 normal-case"}
            aria-label="LOG IN"
            value="legacy"
          >
            {'Login'}
          </Button>

        </Formsy>

        <div className="flex flex-col items-center pt-24">
          <Divider className="mb-16 w-256" />

        </div>

      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitLogin: authActions.submitLogin,
    getAllBranch
  }, dispatch);
}

function mapStateToProps({ auth, branch }) {
  return {
    login: auth.login,
    user: auth.user,
    branch
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(JWTLoginTab)));
