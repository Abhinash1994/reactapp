import React from "react";
import {
  Grid, Button, TextField, Icon, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import MenuItem from "@material-ui/core/MenuItem";
import Validations from '../../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import LabelControl from "../../../components/LabelControl";
class BankManagerDialog extends React.Component {
  state = {
    open: false,
    type: "",
    accountTypes: ["Fixed Account", "Current Account", "Saving Account"],
    row: {
      name: '', acc_type: '', acc_number: '', branch: '', swift_code: '', level_value: '', ledger_code:'',url: ''
    },
  };

  async componentDidMount() {
    this.setState({ type: this.props.type, row: this.props.row });
    // this.handleClickOpen();
  }
  handleClickOpen = () => {
    this.setState({ open: true, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAllClose = () => {
    const { row } = this.state;
    if (row.name === '') {
      NotificationManager.error("Please insert Bank Name!", "Bank Name");
    } else if (row.acc_type === "") {
      NotificationManager.error("Please select account type!", "Account Type");
    } else if (!Validations.IntegerValidation(row.acc_number)) {
      NotificationManager.error("Please select account!", "Account");
    } else if (!Validations.IntegerValidation(row.branch)) {
      NotificationManager.error("Please select brach!", "Branch");
    } else if (row.swift_code === '') {
      NotificationManager.error("Please input swift code!", "Swift Code");
    } else if (!Validations.IntegerValidation(row.level_value)) {
      NotificationManager.error("Please select level!", "Level");
    } else if (!Validations.WebUrlValidation(row.url)) {
      NotificationManager.error("Please check url!", "URL");
    } else {
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    cursor[name] = event.target.value;
    this.setState({ row: cursor });
  };

  render() {
    const { onRemove, branch } = this.props;
    const { row, accountTypes } = this.state;
    return (
      <div>
        {this.state.type === "edit" && (
          <div>
            <IconButton
              onClick={ev => {
                ev.stopPropagation();
                this.handleClickOpen();
              }}
              className='color-limegreen'
            >
              <Icon>edit_attributes</Icon>
            </IconButton>
            <IconButton
              className='color-brown'
              onClick={ev => {
                ev.stopPropagation();
                if (window.confirm("Are you sure to remove this Bank?")) {
                  onRemove(this.state.row);
                }
              }}
            >
              <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        )}
        {this.state.type === "add" && (
          <div className="flex items-center justify-end">
            <Button
              className="normal-case"
              variant="contained"
              color="primary"
              aria-label="Add Message"
              onClick={ev => {
                ev.stopPropagation();
                this.handleClickOpen();
              }}>
              {'Add Bank'}
            </Button>
          </div>
        )}
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Bank</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.type === 'add'
                ? 'To create company, please enter description here.'
                : 'To update company, please enter description here.'
              }
            </DialogContentText>
            <Grid container>
              <Grid item xs={12}>
                <LabelControl label='Bank Name'>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={row.name || ''}
                    error={row.name === ''}
                    onChange={this.handleChange('name')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Account Type'>
                  <TextField
                    fullWidth select
                    variant='outlined'
                    value={row.acc_type || ''}
                    error={row.acc_type === ''}
                    onChange={this.handleChange('acc_type')}>
                    {accountTypes.map((element, index) => (
                      <MenuItem key={index} value={element}>{element}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Account'>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={row.acc_number || ''}
                    error={!Validations.IntegerValidation(row.acc_number)}
                    onChange={this.handleChange('acc_number')} />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Branch Name'>
                  <TextField
                    fullWidth select
                    variant='outlined'
                    value={row.branch || ''}
                    error={!Validations.IntegerValidation(row.branch)}
                    onChange={this.handleChange('branch')}>
                    {branch.map((element) => (
                      <MenuItem key={element.branch_Id} value={element.branch_Id}>{element.branch_Name}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Swift Code'>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={row.swift_code || ''}
                    error={!Validations.IntegerValidation(row.swift_code)}
                    onChange={this.handleChange('swift_code')} />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Level'>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={row.level_value || ''}
                    error={!Validations.IntegerValidation(row.level_value)}
                    onChange={this.handleChange('level_value')} />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='URL'>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={row.url || ''}
                    error={!Validations.WebUrlValidation(row.url)}
                    onChange={this.handleChange('url')} />
                </LabelControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleAllClose();
              }}
              color="secondary"
            >
              {this.state.type === "edit" ? "Update" : 'Add'}
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(BankManagerDialog);
