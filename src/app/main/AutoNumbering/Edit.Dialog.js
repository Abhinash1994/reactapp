import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import Validations from '../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../components/LabelControl';
class UserDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
      type: '',
      startingword: '',
      length: 0,
      starting_no: 0,
    },
  };
  async componentDidMount() {
    this.setState({
      row: this.props.row,
      type: this.props.type
    });
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAllClose = () => {
    const { row } = this.state;
    if (!row.type) {
      NotificationManager.error("Please enter type", "Auto Numbering");
    } else if (!row.startingword) {
      NotificationManager.error("Please enter starting word", "Auto Numbering");
    } else if (!Validations.IntegerValidation(row.length)) {
      NotificationManager.error("Please enter length", "Auto Numbering");
    } else if (!Validations.IntegerValidation(row.starting_no)) {
      NotificationManager.error("Please enter starting no", "Auto Numbering");
    } else {
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    console.log((name === 'type') && !this.state.row.createdBy);
    if ((name === 'type') && !this.state.row.createdBy) {
      return;
    }
    var cursor = this.state.row;
    switch (name) {
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
    const { row } = this.state;
    const roleType = 'Auto Numbering'
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
                  if (window.confirm('Are you sure to remove this user?')) {
                    onRemove(this.state.row);
                  }
                }}>
                <Icon type="small">delete</Icon>
              </IconButton>}
          </div>
        }
        {this.state.type === 'add' && user.roles[roleType] && user.roles[roleType].saveRole &&
          <div className="flex items-center justify-end mb-6">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Auto Numbering Type</Button>
          </div>
        }
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" >Edit Auto Numbering Information</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create autonumber, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update autonumber, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={12}>
                <LabelControl label='Type'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.type || ''}
                    error={!Validations.isEmpty(row.type)}
                    onChange={this.handleChange('type')} />
                </LabelControl>
              </Grid>
              <Grid item xs={4}>
                <LabelControl label='Starting Word'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.startingword || ''}
                    error={!Validations.isEmpty(row.startingword)}
                    onChange={this.handleChange('startingword')} />
                </LabelControl>
              </Grid>
              <Grid item xs={4}>
                <LabelControl label='Length'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.length || 0}
                    error={!Validations.IntegerValidation(row.length)}
                    onChange={this.handleChange('length')} />
                </LabelControl>
              </Grid>
              <Grid item xs={4}>
                <LabelControl label='Starting No'>
                  <TextField
                    fullWidth
                    className='no-padding-input'
                    variant='outlined'
                    value={row.starting_no || 0}
                    error={!Validations.IntegerValidation(row.starting_no)}
                    onChange={this.handleChange('starting_no')} />
                </LabelControl>
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