import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid, FormControlLabel, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import Validations from '../../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../../components/LabelControl';
import TaxService from '../../../services/TaxService';
class CustomerDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      type: '',
      CustomerGroups: [],
      chartOfAccounts: [],
      row: {
        id: 0,
        name: '',
        code: '',
        rate: '',
        type: 1,
        status: false,
      },
      flag: 0,
    };
    this.CreateTax = this.CreateTax.bind(this);
    this.UpdateTax = this.UpdateTax.bind(this);
  }
  async componentDidMount() {
    this.setState({ row: this.props.row, type: this.props.type });
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAllClose = async () => {
    const { row } = this.state;
    if (row.name === '') {
      NotificationManager.error("Please Enter Tax Name", 'Taxsetup Error');
      // } else if (!Validations.IntegerValidation(row.code)) {
      //   NotificationManager.error("Please check Tax code", 'Taxsetup Error');
    } else if (!Validations.DoubleValidation(row.rate)) {
      NotificationManager.error("Please check Tax rate", 'Taxsetup Error');
    } else if (!Validations.DoubleValidation(row.type)) {
      NotificationManager.error("Please check Tax Type", 'Taxsetup Error');
    } else {
      this.setState({ open: false });

      if (row.id > 0)
        await this.UpdateTax();
      else
        await this.CreateTax();

      this.props.onSave(this.state.row, this.state.type);
    }
  };

  async CreateTax() {
    if (this.state.row.status === "") {
      this.state.row.status = false;
    }
    await TaxService.createTax(this.state.row);
  }


  async UpdateTax() {
    if (this.state.row.status === "") {
      this.state.row.status = false;
    }
    let { row } = this.state;
    if (this.state.row.id > 0) {
      var u = {}
      u.id = row.id;
      u.name = row.name;
      u.code = row.code;
      u.rate = row.rate;
      u.type = row.type;
      u.status = row.status;
      await TaxService.updateTax(u);
    }

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
            }}>Add Tax</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className='customer-dialog'
        >
          <DialogTitle id="form-dialog-title" >Tax Info</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create Tax, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Tax, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={12}>
                <LabelControl label="Tax Name">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.name || ''}
                    error={!row.name}
                    onChange={this.handleChange('name')}
                  />
                </LabelControl>
              </Grid>
              {/* <Grid item xs={12}>
                <LabelControl label="Tax Code">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.code || ''}
                    error={!Validations.IntegerValidation(row.code)}
                    onChange={this.handleChange('code')}
                  />
                </LabelControl>
              </Grid> */}
              <Grid item xs={12}>
                <LabelControl label="Tax Rate">
                  <TextField
                    fullWidth
                    variant='outlined'
                    className='no-padding-input'
                    value={row.rate || ''}
                    error={!Validations.DoubleValidation(row.rate)}
                    onChange={this.handleChange('rate')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <LabelControl label="Tax Type">
                  <TextField
                    fullWidth
                    select
                    variant='outlined'
                    className='no-padding-input'
                    value={row.type || ''}
                    error={!Validations.DoubleValidation(row.type)}
                    onChange={this.handleChange('type')}
                  >
                    <MenuItem value={1}>Vat</MenuItem>
                    <MenuItem value={2}>TDS</MenuItem>
                    <MenuItem value={3}>Income Tax</MenuItem>
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel value="status" label='Status' labelPlacement="start"
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