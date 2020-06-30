import React from 'react';
import { connect } from 'react-redux';
import { Menus } from '../../../config'
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  OutlinedInput,
  Button, Grid
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { NotificationManager } from 'react-notifications';

class RoleAssignmentDialog extends React.Component {
  constructor(props) {
    super(props);
    let menus = [];
    for (let key in Menus) {
      menus.push(key);
    }
    this.state = {
      open: false,
      type: props.type,
      row: props.row,
      menus
    };
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    console.log("Menu", this.state.row.menu)
    if (!this.state.row.menu) {
      NotificationManager.error("Please select Menu.")
    } else {
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type, this.state.checkedA);
    }
  };

  onClose = () => {
    this.setState({ open: false })
  }
  handleChange = name => event => {
    var cursor = { ...this.state.row };
    switch (name) {
      case 'menu':
        if (this.state.type === 'edit') {
          NotificationManager.warning("Don`t change menu");
          return;
        }
        cursor[name] = event.target.value;
        break;
      case 'viewRole':
        if (event.target.checked) {
          cursor[name] = event.target.checked;
        } else {
          cursor = {
            ...cursor,
            viewRole: false,
            saveRole: false,
            updateRole: false,
            deleteRole: false,
            printRole: false
          }
        }
        break;
      default:
        if (event.target.checked) {
          cursor.viewRole = true;
        }
        cursor[name] = event.target.checked;
    }
    this.setState({ row: cursor });
  }
  render() {
    const { onRemove, user } = this.props;
    return (
      <div>
        {this.state.type === 'edit' && user.roles['Role Assignment'] &&
          <div className="flex">
            {user.roles['Role Assignment'].updateRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>
              <Icon>edit_attributes</Icon>
            </IconButton>}
            {user.roles['Role Assignment'].deleteRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this company?')) {
                onRemove(this.state.row);
              }
            }}>
              <Icon type="small">delete</Icon>
            </IconButton>}
          </div>
        }
        {this.state.type === 'add' && user.roles['Role Assignment'] && user.roles['Role Assignment'].saveRole &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Role Menu</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Role</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >{'To create Menu Role'}</DialogContentText>
              : <DialogContentText >{'To update Menu Role'}</DialogContentText>
            }
            <Grid container>
              <Grid item sm={12}>
                <Select className="mb-24"
                  native
                  value={this.state.row.menu || ''}
                  onChange={this.handleChange('menu')}
                  input={<OutlinedInput name="Menu" labelWidth={0} id="menu" />}
                  fullWidth>
                  <option value={0} key={0}>{'No Menu'}</option>
                  {
                    this.state.menus.map((item, index) => (
                      <option value={item} key={index + 1}>{item}</option>
                    ))
                  }
                </Select>
              </Grid>
              <Grid item sm={6}>View</Grid>
              <Grid item sm={6}>
                <Checkbox checked={this.state.row.viewRole} onChange={this.handleChange('viewRole')} />
              </Grid>
              <Grid item sm={6}>Save</Grid>
              <Grid item sm={6}>
                <Checkbox checked={this.state.row.saveRole} onChange={this.handleChange('saveRole')} />
              </Grid>
              <Grid item sm={6}>Update</Grid>
              <Grid item sm={6}>
                <Checkbox checked={this.state.row.updateRole} onChange={this.handleChange('updateRole')} />
              </Grid>
              <Grid item sm={6}>Delete</Grid>
              <Grid item sm={6}>
                <Checkbox checked={this.state.row.deleteRole} onChange={this.handleChange('deleteRole')} />
              </Grid>
              <Grid item sm={6}>Print</Grid>
              <Grid item sm={6}>
                <Checkbox checked={this.state.row.printRole} onChange={this.handleChange('printRole')} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
            </Button>
            <Button onClick={this.onClose} color="secondary">
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleAssignmentDialog);