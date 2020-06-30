import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Button, TextField, Grid, Checkbox, FormControlLabel,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import { productTypes, API_URL } from '../../../config';
import Validations from '../../helper/Validations'
import ProductGroupService from '../../services/ProductGroupService'
import FileService from '../../services/FileService'
import { NotificationManager } from 'react-notifications';
import ChartOfAccountService from '../../services/ChartOfAccountService';
import UnitService from '../../services/UnitService';


class ProductServiceDialog extends React.Component {
  state = {
    open: false,
    type: '',
    productGroups: [],
    chartOfAccounts: [],
    units: [],
    row: {
      p_type: '',
      p_name: '',
      d_name: '',
      p_group: '',
      qtyonhand: '',
      p_price: '',
      s_price: '',
      i_account: '',
      e_account: '',
      reorder: '',
      barcode: '',
      istaxable: false,
      taxtype: '',
      subledger: '',
      status: false,
      image: '',
      unit_id: ''
    },
    flag: 0,
  };
  async componentDidMount() {
    const productGroups = await ProductGroupService.getProductGroups();
    const chartOfAccounts = await ChartOfAccountService.getChartOfAccounts();
    const units = await UnitService.getUnitList();
    this.setState({ row: this.props.row, type: this.props.type, productGroups, chartOfAccounts,units });
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
    const { row, productGroups, chartOfAccounts,units } = this.state

    // console.log("000000000000000000000000"+JSON.stringify(user))
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
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create product, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update product, please enter description here.'}
              </DialogContentText>
            }
            <Grid container className='edit-content'>
              <Grid item xs={12}>
                <TextField
                  select fullWidth
                  variant='outlined'
                  label='Product type'
                  value={row.p_type || 0}
                  onChange={this.handleChange('p_type')}>
                  {productTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container>
                <Grid item xs={8}>
                  <Grid item xs={12} className='edit-field'>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Name'
                      value={row.p_name || ''}
                      onChange={this.handleChange('p_name')} />
                  </Grid>
                  <Grid item xs={12} className='edit-field'>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Display Name'
                      value={row.d_name || ''}
                      onChange={this.handleChange('d_name')} />
                  </Grid>
                </Grid>
                <Grid item xs={4} className='show-image'>
                  <img src={`${API_URL}/asset${row.image}`} onClick={this.changeImage} alt='Click here!' />
                </Grid>

              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  select fullWidth
                  variant='outlined'
                  label='Product Group'
                  value={row.p_group || ''}
                  onChange={this.handleChange('p_group')}>
                  {productGroups.map(group => (
                    <MenuItem key={group.id} value={group.id}>{group.group_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Quantity on Hand'
                  value={row.qtyonhand || ''}
                  error={!Validations.IntegerValidation(row.qtyonhand)}
                  onChange={this.handleChange('qtyonhand')} />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Purchase Price'
                  value={row.p_price || ''}
                  error={!Validations.DoubleValidation(row.p_price)}
                  onChange={this.handleChange('p_price')} />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth select
                  variant='outlined'
                  label='Exp. Account'
                  value={row.e_account || ''}
                  error={!Validations.IntegerValidation(row.e_account)}
                  onChange={this.handleChange('e_account')} >
                  {chartOfAccounts.map(coa => (
                    <MenuItem key={coa.id} value={coa.ledger_Code}>{coa.ledger_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Sales Price'
                  value={row.s_price || ''}
                  error={!Validations.DoubleValidation(row.s_price)}
                  onChange={this.handleChange('s_price')} />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth select
                  variant='outlined'
                  label='Income Account'
                  value={row.i_account || ''}
                  error={!Validations.IntegerValidation(row.i_account)}
                  onChange={this.handleChange('i_account')}>
                  {chartOfAccounts.map(coa => (
                    <MenuItem key={coa.id} value={coa.ledger_Code}>{coa.ledger_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Re-order point'
                  value={row.reorder || ''}
                  error={!Validations.IntegerValidation(row.reorder)}
                  onChange={this.handleChange('reorder')} />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='BarCode'
                  value={row.barcode || ''}
                  onChange={this.handleChange('barcode')} />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={row.istaxable}
                      onChange={this.handleChange('istaxable')}
                      inputProps={{
                        'aria-label': 'Is Taxable',
                      }} />
                  }
                  label="Is Taxable"
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Tax Type'
                  value={row.taxtype || 0}
                  error={!Validations.IntegerValidation(row.taxtype)}
                  onChange={this.handleChange('taxtype')} />
              </Grid>

              <Grid item xs={6} className='edit-field'>
                <TextField
                  fullWidth select
                  variant='outlined'
                  label='Unit'
                  value={row.unit_id || ''}
                  error={!Validations.IntegerValidation(row.unit_id)}
                  onChange={this.handleChange('unit_id')}>
                  {units.map(unit => (
                    <MenuItem key={unit.id} value={unit.id}>{unit.unitname}</MenuItem>
                  ))}
                </TextField>
              </Grid>

            </Grid>
            <div className="flex" style={{ justifyContent: 'center' }}>
              <input type='file' ref='fileUploader' style={{ display: 'none' }} onChange={this.handleLogoChange} />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductServiceDialog);