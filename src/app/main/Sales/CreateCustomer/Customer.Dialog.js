import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import Validations from '../../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import { netDues } from '../../../../config'
import LabelControl from '../../../components/LabelControl';
class CustomerDialog extends React.Component {
  state = {
    open: false,
    type: '',
    CustomerGroups: [],
    chartOfAccounts: [],
    row: {
      cust_name: '',
      address: '',
      email: '',
      region: '',
      mob: '',
      tel: '',
      type: '',
      netdues: '',
      s_agent: '',
      status: '',
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
    if (row.cust_name === '') {
      NotificationManager.error("Please check Customer Name", "Customer Name Error");
    } else if (row.address === '') {
      NotificationManager.error("Please check Address", "Address Error");
    } else if (!Validations.EmailValidation(row.email)) {
      NotificationManager.error("Please check Email", "Email Error");
    } else if (row.region === '') {
      NotificationManager.error("Please check Region", "Region Error");
    } else if (!Validations.TelephoneValidation(row.mob)) {
      NotificationManager.error("Please check Mobile", "Moblie Error");
    } else if (!Validations.TelephoneValidation(row.tel)) {
      NotificationManager.error("Please check Mobile", "Moblie Error");
    } else if (!Validations.IntegerValidation(row.netdues)) {
      NotificationManager.error("Please check net dues", "Net Dues Error");
    } else if (!Validations.IntegerValidation(row.netdues)) {
      NotificationManager.error("Please check sales agent", "Sales Agent Error");
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    switch (name) {
      case 'istaxable':
        cursor[name] = event.target.checked;
        break;
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }
  changeImage = () => {
    this.refs.fileUploader.click();
  }
  render() {
    const { onRemove, user } = this.props;
    const { row } = this.state
    return (
      <div>
        {this.state.type === 'edit' && user.roles.Customer &&
          <div className="flex">
            {user.roles.Customer.updateRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}
              className='color-limegreen'>
              <Icon>edit_attributes</Icon>
            </IconButton>}
            {user.roles.Customer.deleteRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this Customer?')) {
                onRemove(this.state.row);
              }
            }}
              className='color-brown'>
              <Icon type="small">delete</Icon>
            </IconButton>}
          </div>
        }
        {this.state.type === 'add' &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Customer</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className='customer-dialog'
        >
          <DialogTitle id="form-dialog-title" >Customer Info</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create Customer, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Customer, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={6}>
                <LabelControl label="Customer Name">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.cust_name || ''}
                    error={!row.cust_name}
                    onChange={this.handleChange('cust_name')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Address">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.address || ''}
                    error={!row.address}
                    onChange={this.handleChange('address')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Email">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.email || ''}
                    error={!Validations.EmailValidation(row.email)}
                    onChange={this.handleChange('email')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Region">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.region || ''}
                    error={!row.region}
                    onChange={this.handleChange('region')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Moblie">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.mob || ''}
                    error={!Validations.TelephoneValidation(row.mob)}
                    onChange={this.handleChange('mob')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Telephone">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.tel || ''}
                    error={!Validations.TelephoneValidation(row.tel)}
                    onChange={this.handleChange('tel')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Net Dues">
                  <TextField
                    fullWidth select
                    variant='outlined'
                    className='no-padding-select'
                    value={row.netdues || ''}
                    error={!Validations.IntegerValidation(row.netdues)}
                    onChange={this.handleChange('netdues')}
                  >
                    {netDues.map(element => (
                      <MenuItem key={element} value={element}>{`Net ${element}`}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Sales Agent">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.s_agent || 0}
                    error={!Validations.IntegerValidation(row.s_agent)}
                    onChange={this.handleChange('s_agent')}
                  />
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDialog);