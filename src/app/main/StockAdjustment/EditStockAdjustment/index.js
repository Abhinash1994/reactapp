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
import ChartOfAccountService from '../../../services/ChartOfAccountService';
import StockAdjustmentService from '../../../services/StockAdjustmentService';
import StockAdjustmentDetailsService from '../../../services/StockAdjustmentDetailsService';
import ProductService from '../../../services/ProductService';
import utils from '../../../helper/utils'
import { NotificationManager } from 'react-notifications';
import { Delete, Add } from '@material-ui/icons';
import PrintService from '../../../services/PrintService';
import LabelControl from '../../../components/LabelControl';

const tableColumes = [
  { id: 'item_id', numeric: false, disablePadding: true, label: 'Item Name' },
  { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
  { id: 'qoh', numeric: false, disablePadding: true, label: 'QOH' },
  { id: 'qty', numeric: false, disablePadding: true, label: 'Adjustment Qty' },
  { id: 'cng_qty', numeric: false, disablePadding: true, label: 'Change in qty' },
  { id: 'price', numeric: false, disablePadding: true, label: 'Price' },
  { id: 'total', numeric: false, disablePadding: true, label: 'Total' },
  { id: 'action', numeric: false, disablePadding: true, label: '' }
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

class EditStockAdjustment extends Component {

  state = {
    order: 'asc',
    orderBy: 'cust_id',
    editRow: 0,
    rows: [],
    ChartOfAccount: [],
    products: [],
    productObjects: {},
    changed: false,
    quomast: {
      date: moment(),
      ledger_Code: 0,
      adj_no: '',
      tax: 1,
      total: 0,
      taxable: 0,
      discount: 0,
      netamount: 0,
      status: 0,
      agent_id: 0,
      remarks: ''
    },
    total: 0
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  createNewRow = () => {
    let row = {
      adj_no: '',
      item_id: '',
      qqh: '',
      qty: '',
      cng_qty: 0,
    };
    let { rows } = this.state;
    rows.push(row);
    this.setState({ rows });
  }

  async componentDidMount() {
    const ChartOfAccount = await ChartOfAccountService.getAllChartOfAccount();
    const products = await ProductService.getProductServices();
    let productObjects = {};
    let ChartOfAccountObjects = {};
    let productOptions = [];
    ChartOfAccount.forEach(element => {
      ChartOfAccountObjects[element.id] = element;
    });
    products.forEach(element => {
      productObjects[element.id] = element;
      productOptions.push({
        value: element.id,
        label: element.p_name
      })
    });
    this.setState({ ChartOfAccount, products, productObjects, productOptions, ChartOfAccountObjects });
    if (this.props.editId) {
      let quomast = await StockAdjustmentService.getStockAdjustment(this.props.editId);
      let rows = await StockAdjustmentDetailsService.getStockAdjustmentDetailByAdjNo(quomast.adj_no);
      this.setState({ quomast, rows, editRow: this.state.rows.length - 1 });
      this.caculationTable(rows);
      this.createNewRow();
      this.setState({editRow: this.state.rows.length - 1 });
    } else {

      this.state.quomast.adj_no = await StockAdjustmentService.getAdjustmentNumber();
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
    quomast.total = this.state.total;
    quomast.netamount = this.state.grand;
    let type = quomast.id ? 'edit' : 'add'
    if (type === 'edit') {
      await StockAdjustmentService.updateStockAdjustment(quomast);
      this.state.rows.forEach(async (r, index) => {
        r.tax = r.vat;
        if (index < this.state.rows.length - 1) {
          if (r.id) {
            await StockAdjustmentDetailsService.updateStockAdjustmentDetail(r);
          } else {
            r.adj_no = quomast.adj_no;
            await StockAdjustmentDetailsService.createStockAdjustmentDetail(r);
          }
        }
      });
      NotificationManager.success('Successfully update invoice', 'Update Invoice');
    } else {
      let newSale = await StockAdjustmentService.createStockAdjustment(quomast);
      if (newSale) {
        this.state.rows.forEach(async (row, index) => {
          row.adj_no = newSale.adj_no;
          if (index < this.state.rows.length - 1) {
            await StockAdjustmentDetailsService.createStockAdjustmentDetail(row);
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
        if (!row.item_id || !row.qty || !row.qty) {
          result = false;
          return;
        }
      }
    });
    return result;
  }

  handleRemove = async row => {
    let result = await StockAdjustmentService.removeStockAdjustment(row.id);
    if (result) {
      this.setState({
        quomast: {
          date: moment().format(),
          cust_id: '',
          adj_no: '',
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
      rows[editRow].s_price = productObjects[rows[editRow].item_id].s_price;
      rows[editRow].qtyonhand = productObjects[rows[editRow].item_id].qtyonhand;
    }
    else if (name === 'qty') {
      rows[editRow].cng_qty = rows[editRow].qty - rows[editRow].qtyonhand;
      rows[editRow].total = rows[editRow].qty * rows[editRow].s_price;
    }
    this.caculationTable(rows);
    this.setState({ changed: true })
  }

  caculationTable = (rows) => {
    let total = 0;
    for (let i = 0; i < rows.length; i++) {
      total += rows[i].total ? rows[i].total : 0;
    }
    this.setState({ total });
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
    let { productObjects, rows, total, vat, grand, ChartOfAccountObjects, quomast } = this.state;
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
      adj_no: quomast.adj_no,
      date: moment(quomast.date).format('YYYY-MM-DD'),
      user: ChartOfAccountObjects[quomast.id].cust_name,
      address: ChartOfAccountObjects[quomast.id].address,
      data, total, vat, grand
    };
    PrintService.printInvoice(printData);
  }
  render() {
    const { classes } = this.props;
    const { order, orderBy, ChartOfAccount, quomast, productObjects, products, editRow, total } = this.state;
    let data = this.state.rows;
    return (
      <React.Fragment>
        <Paper className='mb-16 p-16' style={{ padding: '1em' }}>
          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label='Adjustment No'>
                <TextField
                  className='no-padding-input'
                  fullWidth disabled variant='outlined'
                  value={quomast.adj_no}
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
              <LabelControl label='Ledger Name'>
                <TextField
                  className='no-padding-select'
                  fullWidth select variant='outlined'
                  value={quomast.ledger_Code || ''}
                  onChange={this.handlequomastChange('ledger_Code')}
                >
                  {ChartOfAccount.map((element, index) => (
                    <MenuItem key={index} value={element.ledger_Code}>{element.ledger_name}</MenuItem>
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
                    <TableCell align='left'>{row.desc || '-'}</TableCell>
                    <TableCell align='left' style={{ width: '50px' }}>{row.qqh || 1}</TableCell>
                    <TableCell align='left' style={{ width: '150px' }}>{row.qty || 0}</TableCell>
                    <TableCell align='left' style={{ width: '150px' }}>{row.cng_qty || 0}</TableCell>
                    <TableCell align='left' style={{ width: '150px' }}>{row.s_price || 0}</TableCell>
                    <TableCell align='left' style={{ width: '150px' }}>{row.total || 0}</TableCell>
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
                        value={data[editRow].desc}
                        onChange={this.handleDetailChange('desc')}
                      />
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth disabled variant='outlined'
                        value={data[editRow].qtyonhand}
                        onChange={this.handleDetailChange('qtyonhand')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth variant='outlined'
                        value={data[editRow].qty}
                        onChange={this.handleDetailChange('qty')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth variant='outlined'
                        value={data[editRow].cng_qty}
                        onChange={this.handleDetailChange('cng_qty')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth variant='outlined'
                        value={data[editRow].s_price}
                        onChange={this.handleDetailChange('s_price')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
                    <TableCell align='left'>
                      <TextField
                        className='no-padding-input'
                        fullWidth variant='outlined'
                        value={data[editRow].total}
                        onChange={this.handleDetailChange('total')}
                        style={{ width: '50px' }}
                      />
                    </TableCell>
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
                <TableCell colSpan={6} align='right'>Total</TableCell>
                <TableCell align='left'>{utils.toFixNumber(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className='action-part flex'>
            <LabelControl label='remarks'>
              <TextField
                className='no-padding-input'
                fullWidth variant='outlined'
                onChange={this.handlequomastChange('remarks')}
                value={quomast.remarks}
              />
            </LabelControl>
          </div>

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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EditStockAdjustment));
