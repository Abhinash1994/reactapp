import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import Validations from '../../helper/Validations'
import FileService from '../../services/FileService'
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
class UserLogDialog extends React.Component {
  state = {
    open: false,
    type: '',
    productGroups: [],
    chartOfAccounts: [],
    row: {
      sn: '',
      datetime: '',
      username: '',
      event: '',
      activity: '',
      type: '',
    },
    flag: 0,
  };
  async componentDidMount() {
    this.setState({ row: this.props.row, type: this.props.type });
  }
  handleLogoChange = async e => {
    let file = e.target.files[0];
    console.log(file);
    var form_data = new FormData();
    form_data.append('filepath', 'product_image');
    form_data.append('file', file, file.name);
    let image = await FileService.uploadFile(form_data);
    this.setState({
      row: {
        ...this.state.row,
        image
      }
    })
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
    const { row } = this.state;
    if (row.p_type === '' || !Validations.IntegerValidation(row.p_type)) {
      NotificationManager.error("Please check product type", "Product Type Error");
    } else if (row.p_name === '') {
      NotificationManager.error("Please check product name", "Product Name Error");
    } else if (row.d_name === '') {
      NotificationManager.error("Please check product display name", "Product Display Name Error");
    } else if (row.p_group === '') {
      NotificationManager.error("Please select product group", "Product group Error");
    } else if (row.qtyonhand === '' || !Validations.IntegerValidation(row.p_type)) {
      NotificationManager.error("Please check your quantity on hand value", "Quantity on Hand");
    } else if (row.p_price === '' || !Validations.DoubleValidation(row.p_price)) {
      NotificationManager.error("Please check your purchase pirce value", "Purshase Price");
    } else if (row.s_price === '' || !Validations.DoubleValidation(row.s_price)) {
      NotificationManager.error("Please check your sales pirce value", "Sales Price");
    } else if (row.e_account === '' || !Validations.IntegerValidation(row.e_account)) {
      NotificationManager.error("Please check your exp.account value", "Exp. Account");
    } else if (row.i_account === '' || !Validations.IntegerValidation(row.i_account)) {
      NotificationManager.error("Please check your exp.account value", "Exp. Account");
    } else if (row.reorder === '' || !Validations.IntegerValidation(row.reorder)) {
      NotificationManager.error("Please check your Re-order point value", "Re-order point");
    } else if (row.barcode === '') {
      NotificationManager.error("Please check your Barcode point value", "Barcode");
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
    const { onRemove } = this.props;
    const { row, } = this.state
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
              if (window.confirm('Are you sure to remove this product?')) {
                onRemove(this.state.row);
              }
            }}>
              <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        }
        {this.state.type === 'add' &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Product</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className='product-service-dialog'
        >
          <DialogTitle id="form-dialog-title" >Edit Product</DialogTitle>
          <DialogContent>
            {/* {this.state.type === 'add'
              ? <DialogContentText >
                {'To create product, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update product, please enter description here.'}
              </DialogContentText>
            } */}
            <Grid container className='edit-content'>
              <Grid item xs={12}>
                <TextField
                  fullWidth disabled
                  label='Date Time'
                  value={moment(row.datetime).format("YYYY-MM-DD hh:mm")} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth disabled
                  label='User Name'
                  value={row.username} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth disabled
                  label='Event'
                  value={row.event} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth disabled
                  label='Activity'
                  value={row.activity} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth disabled
                  label='Type'
                  value={row.type} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={this.handleAllClose} color="secondary">
              {this.state.type === 'edit' ? 'Update' : 'Add'}
            </Button> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLogDialog);