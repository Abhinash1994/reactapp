import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid, FormControlLabel, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import Validations from '../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../components/LabelControl';

class UserDialog extends React.Component {
  state = {
    open: false,
    type: '',
    mastGroup: ['Assets', 'Liabities', 'Income', 'Expenses'],
    row: {
      mast_Code: '',
      ledger_Code: '',
      ledger_Group: 0,
      ledger_name: 0,
      is_ledger: false,
      is_subledger: false,
      is_group: false
    },
    ledgerGroup: []
  };
  async componentDidMount() {
    this.setState({
      row: this.props.row,
      type: this.props.type
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type, ledgerGroup: this.props.ledgerGroup });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAllClose = () => {
    const { row } = this.state;
    const title = 'Chart of Account';
    if (!row.mast_Code) {
      NotificationManager.error("Please select Mast Group", title);
    } else if (!row.ledger_name) {
      NotificationManager.error("Please enter ledger name", title);
    } else if (!Validations.IntegerValidation(row.ledger_Group)) {
      NotificationManager.error("Please enter ledger group", title);
    } else if (!Validations.IntegerValidation(row.ledger_Code)) {
      NotificationManager.error("Please enter ledger code", title);
    } else {
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    console.log(event.target.checked);
    if ((name === 'type') && !this.state.row.createdBy) {
      return;
    }
    var cursor = this.state.row;
    switch (name) {
      case ('is_subledger'):
        cursor[name] = event.target.checked;
        break;
      case 'is_group':
        {
          cursor[name] = event.target.checked;
          if (event.target.checked) {
            this.setState({
              row: {
                ...this.state.row,
                mast_Code:100
              }
            })
          }
          break;
        }
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }
  userLock = () => {
    const { row } = this.state;
    if (window.confirm(`Are you sure to ${row.status ? 'lock' : 'unlock'} this user?`)) {
      row.status ? row.status = 0 : row.status = 1;
      this.setState({ open: false });
      this.props.onSave(row, this.state.type);
    }
  }
  render() {
    const { onRemove, user } = this.props;
    const { row, mastGroup, ledgerGroup } = this.state;
    const roleType = 'Chart of Account'
    return (
      <div>
        {this.state.type === 'edit' && user.roles[roleType] &&
          <div className="flex">
            {user.roles[roleType].updateRole &&
              <IconButton
                className='color-limegreen'
                onClick={(ev) => {
                  ev.stopPropagation();
                  this.handleClickOpen();
                }}>
                <Icon>edit_attributes</Icon>
              </IconButton>
            }
            {user.roles[roleType].deleteRole && !!row.createdBy &&
              <IconButton
                className='color-brown'
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (window.confirm('Are you sure to remove this?')) {
                    onRemove(this.state.row);
                  }
                }}>
                <Icon type="small">delete</Icon>
              </IconButton>}
          </div>
        }
        {this.state.type === 'add'
          && user.roles[roleType] &&
          user.roles[roleType].saveRole &&
          <div className="flex items-center justify-end mb-6">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Chart of Account Type</Button>
          </div>
        }
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" >Chart of Account Information</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create Chart of Account, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Chart of Account, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={6}>
                <LabelControl label='Master Group'>
                  <TextField
                    fullWidth select
                    className='no-padding-select'
                    variant='outlined'
                    value={row.mast_Code || ''}
                    error={!Validations.IntegerValidation(row.mast_Code)}
                    onChange={this.handleChange('mast_Code')} >
                    {mastGroup.map((element, index) => (
                      <MenuItem key={index} value={(index + 1) * 100}>{element}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Ledger Name'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.ledger_name || ''}
                    error={!Validations.isEmpty(row.ledger_name)}
                    onChange={this.handleChange('ledger_name')} />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Ledger Group'>
                  <TextField
                    fullWidth select
                    className='no-padding-select'
                    variant='outlined'
                    value={row.ledger_Group || ''}
                    onChange={this.handleChange('ledger_Group')}>
                    {
                      ledgerGroup.map((element, index) => (
                        <MenuItem key={index} value={element.ledger_Group}>{element.group_name}</MenuItem>
                      ))}>
                    </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Ledger Code'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.ledger_Code || 0}
                    error={!Validations.IntegerValidation(row.ledger_Code)}
                    onChange={this.handleChange('ledger_Code')} />
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={row.is_subledger} onChange={this.handleChange('is_subledger')} />}
                  label="Is SubLedger"
                  labelPlacement="start" />

                <FormControlLabel
                  control={<Checkbox checked={row.is_group} onChange={this.handleChange('is_group')} />}
                  label="Is Group"
                  labelPlacement="start" />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDialog);