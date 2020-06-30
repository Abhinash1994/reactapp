import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Checkbox, FormControlLabel,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../components/LabelControl';

class UserRoleDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
      rollname: '',
      status: '',
    },
    checkedA: true,
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleSave = () => {
    if (this.state.row.rollname === '') {
      NotificationManager.error("Please insert FiscalYear!", 'Role Error');
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type, this.state.checkedA);
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  }
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
  handleCheckChange = name => event => {
    this.setState({
      checkedA: event.target.checked
    })
  }

  render() {
    const { row } = this.state;
    const { onRemove, user } = this.props;
    return (
      <div>
        {this.state.type === 'edit' && user.roles['User Role'] &&
          <div className="flex">
            {user.roles['User Role'].updateRole &&
              <IconButton
                className='color-limegreen'
                onClick={(ev) => {
                  ev.stopPropagation();
                  this.handleClickOpen();
                }}>
                <Icon>edit_attributes</Icon>
              </IconButton>}
            {user.roles['User Role'].deleteRole &&
              <IconButton
                className='color-brown'
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (window.confirm('Are you sure to remove this company?')) {
                    onRemove(this.state.row);
                  }
                }}>
                <Icon type="small">delete</Icon>
              </IconButton>}
          </div>
        }
        {this.state.type === 'add' && user.roles['User Role'] && user.roles['User Role'].saveRole &&
          <div className="flex items-center justify-end mb-6">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Role</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Role</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create Role'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Role'}
              </DialogContentText>
            }
            <LabelControl label='Role Name'>
              <TextField
                autoFocus
                variant='outlined'
                value={this.state.row.rollname || ''}
                onChange={this.handleChange('rollname')}
                fullWidth
              />
            </LabelControl>
            <FormControlLabel value="status" label='Status' labelPlacement="start"
              control={<Checkbox checked={row.status}
                onClick={this.handleChange('status')} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleSave();
            }
            } color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleDialog);