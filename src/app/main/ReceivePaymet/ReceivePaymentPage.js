import React, { Component } from 'react';
import {
  withStyles, Typography, Button, MenuItem, Menu, Fade,
  Table, TableBody, TableCell, TableRow, Paper,Grid,TextField
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LabelControl from "../../components/LabelControl";
import * as authActions from 'app/auth/store/actions';
import { SupervisorAccount } from '@material-ui/icons';
import ReactExport from "react-data-export";
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { PrintService, CustomerService } from '../../services';
import ReceivePaymentDialog from './ReceivePayment.Dialog';
import { FusePageSimple, FuseAnimate } from '@fuse';
import moment from 'moment';
import ReceivePaymentService from '../../services/ReceivePaymentService';
import AutoSelect from "app/components/Common/AutoSelect";

const tableColumes = [
  { id: 'sn', numeric: false, disablePadding: true, label: 'S.N.' },
  { id: 'customer', numeric: false, disablePadding: true, label: 'Customer' },
  { id: 'mode', numeric: false, disablePadding: true, label: 'Mode' },
  { id: 'cheque_Date', numeric: false, disablePadding: true, label: 'Cheque Date' },
  { id: 'cheque_No', numeric: false, disablePadding: true, label: 'Cheque No.' },
  { id: 'ref', numeric: false, disablePadding: true, label: 'ref' },
  { id: 'amount', numeric: false, disablePadding: true, label: 'Amount' },
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
  }
});

class ReceivePaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      order: 'asc',
      orderBy: '',
      rows: [],
      page: 0,
      rowsPerPage: 10,
      exportMenu: null,
      customer: [],
    };
    this.PrintData = this.PrintData.bind(this);
  }

  async componentDidMount() {
    const customer = await CustomerService.getCustomerServices();
    let customerObjects = {};
    customer.forEach(element => {
      customerObjects[element.cust_id] = element;
    });
    this.setState({ customer, customerObjects });
    await this.displayData();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  PrintData() {
    if (this.state.rows.length > 0) {
      let dateStr = '';
      // if (this.state.filter.datewise.from !== undefined && this.state.filter.datewise.to !== undefined)
      //     dateStr = "From " + moment(this.state.filter.datewise.from).format('YYYY-MM-DD') + " To " + moment(this.state.filter.datewise.to).format('YYYY-MM-DD')
      var row = [];
      row.date = '';
      row.ledger_name = 'Total';
      row.debit = this.state.debit;
      row.credit = this.state.credit;
      this.state.rows.push(row);
      PrintService.printDaybook(this.state.rows, true, dateStr, 'Day Book');
    }
  }

  handelExport = event => {
    this.setState({
      exportMenu: event.currentTarget
    })
  }

  handleMenuClose = () => {
    this.setState({
      exportMenu: null
    })
  }

  async displayData() {
    const rows = await ReceivePaymentService.getReceivePayments();
    this.setState({ rows });
  }


  handleSave = async (row, type) => {
    this.displayData();
  }

  handleRemove = async row => {
    await ReceivePaymentService.removeReceivePayments(row.id);
    await this.displayData();
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy, exportMenu, customer, customerObjects } = this.state;
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <SupervisorAccount className="text-32 mr-12" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Receive Payment'}</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-16">
            <Paper className="mb-16 p-16" style={{ padding: "1em" }}>
              <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelControl label="Invoice No">
                    <TextField
                      className="no-padding-input"
                      fullWidth
                      disabled
                      variant="outlined"
                      value=""
                    />
                  </LabelControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelControl label="Date">
                    <TextField
                      className="no-padding-input"
                      fullWidth
                      disabled
                      variant="outlined"
                    /* value={moment(salemast.date).format("YYYY-MM-DD")} */
                    />
                  </LabelControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <ReceivePaymentDialog type='add'
                    onSave={this.handleSave}
                    onRemove={this.handleRemove}
                    onClose={this.handleClose}
                    customer={customer}
                    row={{
                      cheque_date: moment(),
                      status: true,
                    }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelControl label="Customer Name">
                    <AutoSelect
                      className="basic-single"
                      value=""
                      /* onChange={this.handleSelectChange} */
                      isSearchable={true}
                      name="cust_id"
                    /* ptions={Arrays(customers, "cust_name","id" )} */
                    />
                  </LabelControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelControl label="Order Reference">
                    <TextField
                      className="no-padding-input"
                      fullWidth
                      variant="outlined"
                      placeholder="Enter Reference No"
                      value=""
                    />
                  </LabelControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className="flex items-center justify-between"
                >
                  <LabelControl label="Balance">
                    <span className="fs-md">0</span>
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
                  {this.state.rows.map((row, index) => (
                    <TableRow key={row.id} className='change-row'>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{customerObjects.hasOwnProperty(row.cust_id) ? customerObjects[row.cust_id].cust_name : '-'}</TableCell>
                      <TableCell align="left">{row.mode || ''}</TableCell>
                      <TableCell align="left">{moment(row.cheque_date).format('YYYY-MM-DD')}</TableCell>
                      <TableCell align="left">{row.cheque_no || '-'}</TableCell>
                      <TableCell align="left">{row.reference || '-'}</TableCell>
                      <TableCell align="left">{row.amount || '-'}</TableCell>
                      <ReceivePaymentDialog type='edit'
                        customer={customer}
                        onSave={this.handleSave}
                        onClose={this.handleClose}
                        row={row} />
                    </TableRow>
                  ))}
                  {this.state.rows.length === 0 &&
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        {'No transactions found.'}
                      </TableCell>
                    </TableRow>
                  }
                  <TableRow>
                    <TableCell align='right' colSpan={8}>
                      <Button className='text-transform-none' onClick={this.PrintData}>Print</Button>
                      <Button
                        className='text-transform-none'
                        aria-controls="export-menu"
                        aria-haspopup="true"
                        onClick={this.handelExport}
                      >
                        {'Export'}
                      </Button>
                      <Menu
                        id="export-menu"
                        anchorEl={exportMenu}
                        keepMounted
                        open={Boolean(exportMenu)}
                        onClose={this.handleMenuClose}
                        TransitionComponent={Fade}
                      >
                        <ReactExport.ExcelFile element={<MenuItem>Excel</MenuItem>}>
                          <ReactExport.ExcelFile.ExcelSheet data={this.state.rows} name="Employees">
                            <ReactExport.ExcelFile.ExcelColumn label="Date" value="date" />
                            <ReactExport.ExcelFile.ExcelColumn label="Trans" value="trans_Id" />
                            <ReactExport.ExcelFile.ExcelColumn label="Ledger" value="ledger_name" />
                            <ReactExport.ExcelFile.ExcelColumn label="Debit" value="debit" />
                            <ReactExport.ExcelFile.ExcelColumn label="Credit" value="credit" />
                            <ReactExport.ExcelFile.ExcelColumn label="Remarks" value="remarks" />
                          </ReactExport.ExcelFile.ExcelSheet>
                        </ReactExport.ExcelFile>
                        <MenuItem onClick={this.ExportPDF}>PDF</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </ div>
        }
      />
    );
  };
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ReceivePaymentPage));
