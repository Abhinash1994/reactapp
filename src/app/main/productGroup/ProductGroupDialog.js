import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton,Checkbox,Button,TextField,
  Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';

class ProductGroupDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
      group_name: '',
      ledger_code: '',
      status: true,
    }
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    if (this.state.row.group_name === '') {
      NotificationManager.error("Please insert Group Name!")
    } else {
      let {row } = this.state;
      row.ledger_code = 0;
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(row, this.state.type);
    }
  };

  onClose = () => {
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
  render() {
    const { onRemove } = this.props;
    return (
      <div>
        {this.state.type === 'edit' &&
          <div className="flex">
            <IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>
              <Icon>edit_attributes</Icon>
            </IconButton>
            <IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this Product Group?')) {
                onRemove(this.state.row);
              }
            }}>
              <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        }
        {this.state.type === 'add' &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Product Group</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Product Group</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create new product group, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update product group, please enter description here.
            </DialogContentText>
            }
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              value={this.state.row.group_name || ''}
              // error={!Validations.IntegerValidation(this.state.row.group_name)}
              onChange={this.handleChange('group_name')}
              fullWidth
            />
            {/* <TextField
              autoFocus
              margin="dense"
              label="Code"
              value={this.state.row.ledger_code || ''}
              error={!Validations.IntegerValidation(this.state.row.ledger_code)}
              onChange={this.handleChange('ledger_code')}
              fullWidth
            /> */}
            <DialogContentText >
              Status:
            </DialogContentText>
            <Checkbox checked={this.state.row.status} onChange={this.handleChange('status')} />

          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleClose();
            }
            } color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
            </Button>
            <Button onClick={() => this.onClose()} color="secondary">
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductGroupDialog);