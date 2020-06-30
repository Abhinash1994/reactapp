import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, Grid, FormControlLabel, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import Validations from '../../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import { CustomTextField } from '../../../components';
class CustomerDialog extends React.Component {
  state = {
    open: false,
    type: '',
    CustomerGroups: [],
    chartOfAccounts: [],
    row: {
      name: '',
      headName: '',
      ledger_code: '',
      status: false
    },
    flag: 0,
  };
  async componentDidMount() {
    this.setState({ row: this.props.row, type: this.props.type });
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAllClose = () => {
    const { row } = this.state;
    if (row.headName === '') {
      NotificationManager.error("Please Enter Tax Name", 'Taxsetup Error');
    } else if (!Validations.IntegerValidation(row.ledger_code)) {
      NotificationManager.error("Please check Tax code", 'Taxsetup Error');
    } else {
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    switch (name) {
      case 'status':
        cursor[name] = event.target.checked;
        break;
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }
  render() {
    const { onRemove, user } = this.props;
    const { row } = this.state
    return (
      <div>
        {this.state.type === 'edit' && user.roles.Customer &&
          <div className="flex">
            {user.roles.Customer.updateRole &&
              <IconButton
                className='color-limegreen'
                onClick={(ev) => {
                  ev.stopPropagation();
                  this.handleClickOpen();
                }}
              >
                <Icon>edit_attributes</Icon>
              </IconButton>}
            {user.roles.Customer.deleteRole &&
              <IconButton
                className='color-brown'
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (window.confirm('Are you sure to remove this Tax?')) {
                    onRemove(this.state.row);
                  }
                }}
              >
                <Icon type="small">delete</Icon>
              </IconButton>}
          </div>
        }
        {this.state.type === 'add' &&
          <div className="flex items-center justify-end mb-6">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Salary</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className='customer-dialog'
        >
          <DialogTitle id="form-dialog-title" >Salary Info</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create Salary, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Salary, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={12}>
                <CustomTextField
                  label='Salary Head'
                  validation={Validations.isEmpty}
                  value={row.headName}
                  onChange={this.handleChange('headName')}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label='Ledger Name'
                  validation={Validations.IntegerValidation}
                  value={row.ledger_code}
                  onChange={this.handleChange('ledger_code')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel label='Status' labelPlacement="start"
                  control={<Checkbox checked={row.status}
                    onClick={this.handleChange('status')} />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAllClose} color="secondary">
              {this.state.type === 'edit' ? 'Update' : 'Add'}
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDialog);