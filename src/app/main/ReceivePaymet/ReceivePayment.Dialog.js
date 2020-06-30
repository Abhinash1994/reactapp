import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import { LabelControl } from '../../components';
import Validations from '../../helper/Validations';
import moment from 'moment';
import ReceivePaymentService from '../../services/ReceivePaymentService';
import ReceivePaymentModel from '../../models/model'

class ReceivePaymentDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      type: '',
      ModeList: [{ id: 0, name: 'Cash' }, { id: 1, name: 'Cheque' }, { id: 2, name: 'Bank Account' }],
      customer: [],
      row: ReceivePaymentModel,
    };
    this.savePayment = this.savePayment.bind(this);
  }

  componentDidMount() {
    let { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }

  handleClickOpen = () => {
    let { row, type } = this.state;
    this.setState({ open: true, row: this.props.row, type: this.props.type, customer: this.props.customer });
    if (type === 'add')
      row.cheque_date = moment();
    else if (type === 'edit')
      row.cheque_date = this.props.row.cheque_date;

  };

  handleClose = async () => {
    this.setState({ flag: 0 })
    await this.savePayment();
    this.setState({ open: false });
    this.props.onSave(this.state.row, this.state.type);
  };

  async savePayment() {
    await ReceivePaymentService.createReceivePayment(this.state.row);
  }

  onClose = () => {
    this.setState({ open: false });
  }

  handleChange = name => event => {
    var cursor = this.state.row;
    switch (name) {
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }

  async onRemove() {
    await ReceivePaymentService.removeReceivePayments(this.state.row.id);
  }

  render() {
    let { ModeList, customer, row } = this.state;
    return (
      <div>
        {this.state.type === 'edit' &&
          <div className="flex">
            {<IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}
              className='color-limegreen'>
              <Icon>edit_attributes</Icon>
            </IconButton>}
            {/* {user.roles.Project && <IconButton onClick={(ev) => { */}
            {<IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this ?')) {
                this.onRemove();
              }
            }}
              className='color-brown'>
              <Icon type="small">delete</Icon>
            </IconButton>}
          </div>
        }
        {
          this.state.type === 'add' &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Payment" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Payment</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
          className='customer-dialog'
        >
          <DialogTitle id="form-dialog-title">Payment</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create new Payment, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update Payment, please enter description here.
            </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={6}>
                <LabelControl label='Customer'>
                  <TextField
                    className='no-padding-select'
                    fullWidth select variant='outlined'
                    value={row.cust_id}
                    onChange={this.handleChange('cust_id')}
                  >
                    {customer.map((element, index) => (
                      <MenuItem key={element.cust_id} value={element.cust_id}>{element.cust_name}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Mode'>
                  <TextField
                    select fullWidth
                    className='no-padding-select'
                    variant='outlined'
                    value={row.mode}
                    onChange={this.handleChange('mode')}>
                    {ModeList.map((element, index) => (
                      <MenuItem key={index} value={element.name}>{element.name}</MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Amount'>
                  <TextField
                    autoFocus fullWidth
                    value={row.amount || ''}
                    error={!Validations.IntegerValidation(row.amount)}
                    onChange={this.handleChange('amount')}
                    className='no-padding-input' variant='outlined'
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Reference'>
                  <TextField
                    value={row.reference || ''}
                    onChange={this.handleChange('reference')}
                    fullWidth
                    className='no-padding-input' variant='outlined'
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Cheque Date'>
                  <TextField
                    fullWidth
                    type="date"
                    className='no-padding-input' variant='outlined'
                    value={moment(row.cheque_date).format("YYYY-MM-DD") || moment().format('YYYY-MM-DD')}
                    onChange={this.handleChange('cheque_date')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Cheque No.'>
                  <TextField
                    autoFocus fullWidth
                    value={row.cheque_no || ''}
                    error={!Validations.IntegerValidation(row.chequcheque_noeNo)}
                    onChange={this.handleChange('cheque_no')}
                    className='no-padding-input' variant='outlined'
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Remarks'>
                  <TextField
                    autoFocus fullWidth
                    value={row.remarks || ''}
                    onChange={this.handleChange('remarks')}
                    className='no-padding-input' variant='outlined'
                  />
                </LabelControl>
              </Grid>
            </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePaymentDialog);