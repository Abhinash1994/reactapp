import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles, Button,
  Table, TableBody, TableCell, TableRow, Paper, Grid, TextField, MenuItem, IconButton
} from '@material-ui/core';
import moment from 'moment';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
// import { stableSort, getSorting } from '../../../helper/TableSortHepler'
import CustomerService from '../../../services/CustomerService';
import EstimateService from '../../../services/EstimateService';
import EstimateDetailsService from '../../../services/EstimateDetailsService';
import ProductService from '../../../services/ProductService';
import { taxType } from '../../../../config'
import utils from '../../../helper/utils'
import { NotificationManager } from 'react-notifications';
import { Delete, Add } from '@material-ui/icons';
import PrintService from '../../../services/PrintService';
import LabelControl from '../../../components/LabelControl';

const tableColumes = [
  { id: 'item_id', numeric: false, disablePadding: true, label: 'Item Name' },
  { id: 'qty', numeric: false, disablePadding: true, label: 'Qty' },
  { id: 'unit_id', numeric: false, disablePadding: true, label: 'Unit' },
  { id: 'price', numeric: false, disablePadding: true, label: 'Price' },
  { id: 'total', numeric: false, disablePadding: true, label: 'Total' },
  { id: 'tax', numeric: false, disablePadding: true, label: 'Vat' },
  { id: 'netdues', numeric: false, disablePadding: true, label: 'Grand' },
  { id: 'action', numeric: false, disablePadding: true, label: '' },
];

const styles = theme => ({
  layoutHeader: {
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down('md')]: {
      height: 240,
      minHeight: 240
    }
  },
});

class EditInvoice extends Component {

  state = {
    order: 'asc',
    orderBy: 'cust_id',
    editRow: 0,
    rows: [],
    customers: [],
    products: [],
    productObjects: {},
    changed: false,
    quomast: {
      date: moment(),
      cust_id: 0,
      inv_no: '',
      tax: 1,
      taxable: 0,
      discount: 0,
      netamount: 0,
      status: 0,
      agent_id: 0
    },
    total: 0,
    grand: 0,
    vat: 0
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  createNewRow = () => {
    let row = {
      inv_no: '',
      item_id: '',
      unit_id: '',
      price: '',
      qty: '',
      total: 0,
      discount: '',
      tax: 0,
      net_amount: '',
      status: 1,
      vat: 0
    };
    let { rows } = this.state;
    rows.push(row);
    this.setState({ rows });
  }

  async componentDidMount() {
    const customers = await CustomerService.getCustomerServices();
    const products = await ProductService.getProductServices();
    let productObjects = {};
    let customerObjects = {};
    let productOptions = [];
    customers.forEach(element => {
      customerObjects[element.cust_id] = element;
    });
    products.forEach(element => {
      productObjects[element.id] = element;
      productOptions.push({
        value: element.id,
        label: element.p_name
      })
    });
    this.setState({ customers, products, productObjects, productOptions, customerObjects });
    if (this.props.editId) {
      let quomast = await EstimateService.getQuotation(this.props.editId);
      let rows = await EstimateDetailsService.getQuotationDetailsByInv(quomast.inv_no);
      this.setState({ quomast });
      this.caculationTable(rows);
      this.createNewRow();
    } else {

      this.state.quomast.inv_no = await EstimateService.getInvoiceNumber();
      this.createNewRow();
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  handleSave = async () => {
    if (!this.checkBeforeSave()) {
      NotificationManager.error('Please check your invoice', 'Input Error');
      return;
    }
    let quomast = this.state.quomast;
    quomast.tax = this.state.vat;
    quomast.taxable = this.state.total;
    quomast.netamount = this.state.grand;
    let type = quomast.id ? 'edit' : 'add'
    if (type === 'edit') {
      await EstimateService.updateQuotation(quomast);
      this.state.rows.forEach(async (r, index) => {
        r.tax = r.vat;
        if (index < this.state.rows.length - 1) {
          if (r.id) {
            await EstimateDetailsService.updateQuotationDetails(r);
          } else {
            r.inv_no = quomast.inv_no;
            await EstimateDetailsService.createQuotationDetail(r);
          }
        }
      });
      NotificationManager.success('Successfully update invoice', 'Update Invoice');
    } else {
      let newSale = await EstimateService.createQuotation(quomast);
      if (newSale) {
        this.state.rows.forEach(async (row, index) => {
          row.inv_no = newSale.inv_no;
          row.tax = row.vat;
          if (index < this.state.rows.length - 1) {
            await EstimateDetailsService.createQuotationDetail(row);
          }
        });
        this.setState({ quomast: newSale });
        NotificationManager.success('Successfully create invoice', 'Create Invoice');
      }
    }
    this.setState({ changed: false });
  }

  checkBeforeSave = () => {
    let { rows } = this.state;
    let result = true;
    rows.forEach((row, index) => {
      if (index < row.length - 1) {
        if (!row.item_id || !row.qty || !row.price) {
          result = false;
          return;
        }
      }
    });
    return result;
  }

  handleRemove = async row => {
    let result = await EstimateService.removeQuotation(row.id);
    if (result) {
      this.setState({
        quomast: {
          date: moment().format(),
          cust_id: '',
          inv_no: '',
          tax: 1,
          discount: 0,
          netamount: '',
          status: 1,
          agent_id: 0
        }
      });
      if (this.props.onRemove) {
        this.props.onRemove(row.id);
      }
    }
  }

  removeDetail = async index => {
    let { rows } = this.state;
    rows = rows.filter((element, rowIndex) => (
      rowIndex !== index
    ))
    this.setState({ rows, editRow: this.state.rows.length - 2 });

    if (rows.length === 0) {
      this.createNewRow();
      return;
    }
    this.countTotal();
  }

  handlequomastChange = name => event => {
    switch (name) {
      default:
        this.setState({
          quomast: {
            ...this.state.quomast,
            [name]: event.target.value
          }
        })
    }
    if (name === 'tax') this.caculationTable(this.state.rows, event.target.value);
    this.setState({ changed: true })
  }
  handleDetailChange = name => event => {
    let { rows, editRow, productObjects } = this.state;
    rows[editRow][name] = event.target.value;
    if (name === 'item_id') {
      rows[editRow].price = productObjects[rows[editRow].item_id].s_price;
      rows[editRow].vat = productObjects[rows[editRow].item_id].taxtype;
    }
    this.caculationTable(rows);
    this.setState({ changed: true })
  }

  caculationTable = (rows, tax = this.state.quomast.tax) => {
    let total = 0;
    let grand = 0;
    let vat = 0;
    for (let i = 0; i < rows.length; i++) {
      rows[i].total = rows[i].qty * rows[i].price;
      rows[i].vat = rows[i].item_id ? rows[i].total * (tax / Math.abs(tax)) * this.state.productObjects[rows[i].item_id].taxtype / 100 : 0;
      rows[i].grand = rows[i].total + rows[i].vat;
      total += rows[i].total ? rows[i].total : 0;
      grand += rows[i].grand ? rows[i].grand : 0;
      vat += rows[i].vat ? rows[i].vat : 0;
    }
    this.setState({ rows, grand, total, vat });
  }
  changeEditRow = editRow => {
    let { rows } = this.state;
    if (editRow < rows.length) {
      return;
    }
    this.setState({ editRow });
  }

  countTotal = () => {
    let { rows, grand, total, vat } = this.state;
    total = 0;
    grand = 0;
    vat = 0;
    rows.forEach(element => {
      grand += element.grand;
      total += element.total;
      vat += element.vat;
    });
    this.setState({ grand, total, vat });
  }

  async addNewRow(index) {
    let { rows } = this.state;
    if (!rows[index].item_id) {
      NotificationManager.error('Please Select Item first.');
      return;
    }
    await this.createNewRow();
    this.setState({ editRow: this.state.editRow + 1 })
  }

  print = () => {
    let { productObjects, rows, total, vat, grand, customerObjects, quomast } = this.state;
    let data = [];
    rows.forEach((element, index) => {
      if (index < rows.length - 1) {
        data.push({
          ...element,
          item: productObjects[element.item_id] && productObjects[element.item_id].p_name,
        })
      }
    })
    let printData = {
      title: 'INVOICE',
      inv_no: quomast.inv_no,
      date: moment(quomast.date).format('YYYY-MM-DD'),
      user: customerObjects[quomast.cust_id].cust_name,
      address: customerObjects[quomast.cust_id].address,
      data, total, vat, grand
    };
    PrintService.printInvoice(printData);
  }
  render() {
    const { classes } = this.props;
    const { order, orderBy, customers, quomast, productObjects, products, editRow, total, grand, vat } = this.state;
    let data = this.state.rows;
    return (
      <React.Fragment>
        <Paper className='mb-16 p-16' style={{ padding: '1em' }}>
          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label='Invoice No'>
                <TextField
                  className='no-padding-input'
                  fullWidth disabled variant='outlined'
                  value={quomast.inv_no}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label='Date'>
                <TextField
                  className='no-padding-input'
                  fullWidth disabled variant='outlined'
                  value={moment(quomast.date).format('YYYY-MM-DD')}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label='Customer Name'>
                <TextField
                  className='no-padding-select'
                  fullWidth select variant='outlined'
                  value={quomast.cust_id || ''}
                  onChange={this.handlequomastChange('cust_id')}
                >
                  {customers.map((element, index) => (
                    <MenuItem key={index} value={element.cust_id}>{element.cust_name}</MenuItem>
                  ))}
                </TextField>
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label='Order Reference'>
                <TextField
                  className='no-padding-input'
                  fullWidth variant='outlined'
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <LabelControl label='Barcode'>
                <TextField
                  className='no-padding-input'
                  fullWidth variant='outlined'
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <LabelControl label='Tax Type'>
                <TextField
                  className='no-padding-select'
                  fullWidth select variant='outlined'
                  value={(quomast.tax / Math.abs(quomast.tax)) || ''}
                  onChange={this.handlequomastChange('tax')}
                >
                  {taxType.map((element, index) => (
                    <MenuItem key={index} value={element.value}>{element.label}</MenuItem>
                  ))}
                </TextField>
              </LabelControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.root} style={{ padding: '1em' }}>
          <Table className={classes.table}>
            <EnhancedTableHead
              rows={tableColumes}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.map((row, index) => (
                (index !== editRow)
                  ? <TableRow key={index} className='unedit-row' onClick={() => this.changeEditRow(index)}>
                    <TableCell align='left'>{productObjects[row.item_id] && productObjects[row.item_id].p_name}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.qty || 1}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.Unit || 1}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.price || 0}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.total || 0}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.vat || 0}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.grand || 0}</TableCell>
                    <TableCell align='left'>
                      <IconButton onClick={() => this.removeDetail(index)} className='color-brown'>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  : <TableRow key={index} className='edit-row'>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-select'
                        fullWidth select variant='outlined'
                        value={data[editRow].item_id}
                        onChange={this.handleDetailChange('item_id')}
                        InputLabelProps={{ shrink: false }}
                        SelectProps={{ padding: '5px' }}
                      >
                        {products.map((element, index) => (
                          <MenuItem key={index} value={element.id}>{element.p_name}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input text-center'
                        fullWidth variant='outlined' margin='none'
                        value={data[editRow].qty}
                        onChange={this.handleDetailChange('qty')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left'>{row.Unit}</TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth variant='outlined'
                        value={data[editRow].price}
                        onChange={this.handleDetailChange('price')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.total}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.vat}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.grand}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>
                      {
                        data[editRow].item_id === ''
                        && <IconButton onClick={() => this.removeDetail(index)} className='color-brown'>
                          <Delete />
                        </IconButton>
                      }
                      {
                        data[editRow].item_id !== ''
                        &&
                        <IconButton onClick={() => this.addNewRow(index)} className='color-brown'>
                          <Add />
                        </IconButton>
                      }

                    </TableCell>
                  </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align='right'>Total</TableCell>
                <TableCell align='left'>{utils.toFixNumber(total)}</TableCell>
                <TableCell align='left'>{utils.toFixNumber(vat)}</TableCell>
                <TableCell align='left'>{utils.toFixNumber(grand)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className='action-part flex justify-end'>
            <Button onClick={this.handleSave} variant='contained' color='primary' disabled={!this.state.changed}>
              {quomast.id ? 'Update' : 'Save'}
            </Button>
            {quomast.id && <Button variant='contained' color='primary' onClick={() => this.handleRemove(quomast)}>Delete</Button>}
            {quomast.id && <Button variant='contained' color='primary' onClick={this.print}>Print</Button>}
            {this.props.editClose && <Button variant='contained' color='primary' onClick={this.props.editClose}>Cancel</Button>}
          </div>
        </Paper>
      </React.Fragment>
    )
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EditInvoice));
