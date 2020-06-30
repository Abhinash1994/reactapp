import React, { Component } from 'react';
import {
  withStyles, TablePagination, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableRow, Paper, Grid
} from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import FilterDialog from './Filter.Dialog';
import moment from 'moment';
import TaxService from '../../../services/TaxService';
import Variables from '../../../../variables';
import LabelControl from '../../../components/LabelControl';
import utils from '../../../helper/utils';

const tableColumes = [
  { id: 's.n', numeric: false, disablePadding: true, label: 'S.N' },
  { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'trans_no', numeric: false, disablePadding: true, label: 'Transaction No' },
  { id: 'ledger', numeric: false, disablePadding: true, label: 'Ledger Name' },
  { id: 'detail', numeric: false, disablePadding: true, label: 'Remark' },
  { id: 'dr', numeric: false, disablePadding: true, label: 'Dr.' },
  { id: 'cr', numeric: false, disablePadding: true, label: 'Cr.' },
  { id: 'balance', numeric: false, disablePadding: true, label: 'Balance' }
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

class SaleReportPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: '',
      rows: [],
      ledgers: [],
      page: 0,
      debit: 0,
      credit: 0,
      rowsPerPage: 10,
      showFilter: false,
      filter: {
        ledger: 'All Ledgers',
        datewise: {},
        types: []
      },
      dateType: 'Today',
    };

    this.viewReportData = this.viewReportData.bind(this);
    this.changeLedger = this.changeLedger.bind(this);
  }


  handleClose = () => {
    this.setState({ open: false });
  }

  async viewReportData() {
    var filters = {};
    filters.ledger = this.state.filter.ledger;
    filters.from = this.state.filter.datewise.from === undefined ? "" : this.state.filter.datewise.from;
    filters.to = this.state.filter.datewise.to === undefined ? "" : this.state.filter.datewise.to;
    let reportData = await TaxService.getTaxReport(filters);
    let { rows, debit, credit } = this.state;
    rows = [];
    debit = 0;
    credit = 0;
    reportData.forEach(element => {
      let RD = [];
      RD.id = element.id;
      RD.trans_Id = element.trans_Id;
      RD.name = element.name;
      RD.Code =element.Code
      RD.remark = element.remarks;
      // if (element.type === 1) {
      //   RD.type = 'VAT';
      // }
      // else if (element.type === 2) {
      //   RD.type = 'TDS';
      // }
      // else if (element.type === 3) {
      //   RD.type = 'Income Tax';
      // }
      RD.dr = element.debit;
      RD.cr = element.credit;
      RD.balance = element.balance;
      rows.push(RD);
      debit += element.debit;
      credit += element.credit;
    });
    this.setState({ rows, debit, credit });
  }

  async getLedgers() {
    let { ledgers } = this.state;
    var list = await TaxService.getTaxLedgers();
    let ILED = [];
    ILED.id = 0;
    ILED.name = "All Ledgers";
    ledgers.push(ILED);
    list.forEach(element => {
      let LED = [];
      LED.id = element.id;
      LED.Code = element.name;
      ledgers.push(LED);
    });
    this.setState({ ledgers });
  }

  async componentDidMount() {
    this.state.filter.datewise = utils.getDateRange(this.state.dateType);
    await this.getLedgers();
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  showFilter = () => {
    this.setState({ showFilter: true });
  }

  filtering = () => {
    let { rows, filter } = this.state;
    let total = 0;
    let result = rows.filter(element => {
      let flag = (!filter.types.length || filter.types.includes(element.type))
        && (!moment.isMoment(filter.datewise.from) || (moment(element.date) >= filter.datewise.from))
        && (!moment.isMoment(filter.datewise.to) || (moment(element.date) <= filter.datewise.to))
        && (!filter.name.length || (filter.name === element.name));
      if (flag) {
        total += element.total;
      }
      return flag;
    });
    rows = [];
    return { result, total };
  }
  changeDateRange = name => event => {
    this.setState({
      rows: [],
      dateType: 'Custom',
      filter: {
        ...this.state.filter,
        datewise: {
          ...this.state.filter.datewise,
          [name]: moment(event.target.value)
        }
      }
    });
  }

  changeDate = (event) => {
    this.setState({
      dateType: event.target.value,
      filter: {
        ...this.state.filter,
        datewise: utils.getDateRange(event.target.value)
      }
    })
  }

  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }

  changeLedger = (event) => {
    this.setState({
      filter: {
        ...this.state.filter,
        ledger: event.target.value
      }
    })

  }

  render() {
    const { classes } = this.props;
    const { dateTypes } = Variables;
    const { order, orderBy, filter, page, rowsPerPage, debit, credit, ledgers, dateType, rows } = this.state;
    return (
      <FusePageSimple
        content={
          <div className="p-16 sm:p-24">
            <Paper className={`${classes.root} mb-16`} style={{ padding: '1em' }}>
              <Grid container>
                <Grid item xs={2}>
                  <LabelControl label='Ledger'>
                    <TextField
                      select fullWidth
                      variant='outlined'
                      value={filter.ledger}
                      onChange={this.changeLedger}
                    >
                      {ledgers.map((element, index) => (
                        <MenuItem value={element.Code} key={index}>{element.name}</MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={2}>
                  <LabelControl label='Date'>
                    <TextField
                      select
                      variant='outlined'
                      value={dateType || ''}
                      onChange={this.changeDate}
                    >
                      {dateTypes.map((element, index) => (
                        <MenuItem value={element} key={index}>{element}</MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={3}>
                  {filter.datewise.from !== '' &&
                    <LabelControl label='From'>
                      <TextField
                        type='date'
                        variant='outlined'
                        value={filter.datewise.from === undefined ? '' : filter.datewise.from.format('YYYY-MM-DD')}
                        onChange={this.changeDateRange('from')}
                      />
                    </LabelControl>}
                </Grid>
                <Grid item xs={3}>
                  {filter.datewise.to !== '' &&
                    <LabelControl label='To'>
                      <TextField
                        type='date'
                        variant='outlined'
                        value={filter.datewise.to === undefined ? '' : filter.datewise.to.format('YYYY-MM-DD')}
                        onChange={this.changeDateRange('to')}
                      />
                    </LabelControl>}
                </Grid>
                <Grid item xs={2} className='flex items-center justify-end'>
                  <Button className='text-transform-none' onClick={this.viewReportData} >View</Button>
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
                  {rows.length === 0 &&
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        {'No Tax Report found.'}

                      </TableCell>
                    </TableRow>
                  }
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{moment(row.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell align="left">{row.trans_Id}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.remark || ''}</TableCell>
                      <TableCell align="left">{row.dr}</TableCell>
                      <TableCell align="left">{row.cr}</TableCell>
                      <TableCell align="left">{row.balance}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align='right' colSpan={5}>Total</TableCell>
                    <TableCell align='left'>{debit}</TableCell>
                    <TableCell align='left'>{credit}</TableCell>
                    <TableCell align='left'></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
            {this.state.filter &&
              <FilterDialog
                onClose={this.onFilterDialogClose}
                changeFilter={this.changeFilter}
                filter={this.state.filter}
                ledgers={this.state.ledgers}
                open={this.state.showFilter} />
            }
          </div>
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SaleReportPage));
