import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton
} from '@material-ui/core';
import Validations from '../../helper/Validations';

class CompanyDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
      branch_Name: '',
      braanch_Code: '',
      address: '',
      telephone_No: '',
      email_Id: '',
    }
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }
  handleLogoChange = (e) => {
    let file = e.target.files[0];
    var cursor = this.state.row;
    cursor['Logo'] = file;
    this.setState({ row: cursor });

    // this.props.row.Logo = 
    // alert(this.state.row.Logo)
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAllClose = () => {
    let { row } = this.state;
    if (this.state.row.branch_Name === '') {
      alert("Please insert Branch Name!")
    } else if (this.state.row.braanch_Code === '') {
      alert("Please insert Branch Code!")
    } else if (this.state.row.address === '') {
      alert("Please insert Address!")
    } else if (this.state.row.telephone_No === '') {
      alert("Please insert Telephone!")
    } else if (this.state.row.email_Id === '') {
      alert("Please insert Email ID!")
    } else if (!Validations.EmailValidation(row.email_Id)) {
      alert("Please check your Email ID!")
    } else if (!Validations.IntegerValidation(row.branch_Code)) {
      alert("Please check your Brach Code!")
    } else if (!Validations.TelephoneValidation(row.telephone_No)) {
      alert("Please check your Telephone Number!")
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    cursor[name] = event.target.value;
    this.setState({ row: cursor });
  }

  render() {
    const { onRemove, user } = this.props;

    return (
      <div>
        {this.state.type === 'edit' && user.roles.Branch &&
          <div className="flex">
            {user.roles.Branch.updateRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>
              <Icon>edit_attributes</Icon>
            </IconButton>}
            {user.roles.Branch.deleteRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this Branch?')) {
                onRemove(this.state.row);
              }
            }}>
              <Icon type="small">delete</Icon>
            </IconButton>}
          </div>

        }
        {this.state.type === 'add' && user.roles.Branch && user.roles.Branch.saveRole &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Branch</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Branch</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create branch, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update branch, please enter description here.
            </DialogContentText>
            }
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              name="Name"
              label="Branch Name"
              value={this.state.row.branch_Name}
              onChange={this.handleChange('branch_Name')}
              variant='outlined'
              fullWidth
            />
            <TextField
              margin="dense"
              id="BranchCode"
              name="BranchCode"
              label="BranchCode"
              error={!Validations.IntegerValidation(this.state.row.branch_Code)}
              helperText='Plaease input only number'
              value={this.state.row.branch_Code}
              onChange={this.handleChange('branch_Code')}
              variant='outlined'
              fullWidth
            />
            <TextField
              margin="dense"
              id="Address"
              name="Address"
              label="Address"
              value={this.state.row.address}
              onChange={this.handleChange('address')}
              variant='outlined'
              fullWidth
            />

            <TextField
              margin="dense"
              id="Telephone"
              name="Telephone"
              label="Telephone"
              value={this.state.row.telephone_No}
              onChange={this.handleChange('telephone_No')}
              variant='outlined'
              error={!Validations.TelephoneValidation(this.state.row.telephone_No)}
              helperText='Incorrect your email.'
              fullWidth
            />

            <TextField
              margin="dense"
              id="Email"
              name="Eamil"
              label="Email ID"
              value={this.state.row.email_Id}
              onChange={this.handleChange('email_Id')}
              variant='outlined'
              error={!Validations.EmailValidation(this.state.row.email_Id)}
              fullWidth
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleAllClose();
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDialog);