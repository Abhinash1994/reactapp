import React, { Component } from 'react';
import {
  Typography, Button, TablePagination,
  Table, TableBody, TableCell, TableRow, Paper, IconButton
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../../helper/TableSortHepler'
// import FilterDialog from './Filter.Dialog';
import BudgetDialog from './Budget.Dialog';
import { SupervisorAccount, EditAttributes, Delete } from '@material-ui/icons';
import moment from 'moment';
import { BudgetService, FiscalService } from '../../../services';
const tableColumes = [
  { id: 'no', numeric: false, disablePadding: true, label: 'S.N.', width: '20px' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'fiscalYear', numeric: false, disablePadding: true, label: 'Fiscal Year' },
  { id: 'interval', numeric: false, disablePadding: true, label: 'Interval' },
  { id: 'actions', numeric: false, disablePadding: true, label: '', width: '125px' },
];
const intervals = [
  {},
  { label: 'Monthly', value: 1 },
  { label: 'Quarterly', value: 2 },
  { label: 'Yearly', value: 3 }
];
class ManagerBudget extends Component {

  state = {
    order: 'asc',
    orderBy: '',
    edit: false,
    editRow: 0,
    rows: [],
    customers: [],
    page: 0,
    rowsPerPage: 10,
  };

  async componentDidMount() {
    let rows = await BudgetService.getBudgets();
    const fiscalYears = await FiscalService.getAllFiscal();
    let fiscalYearObjects = {};
    fiscalYears.forEach(element => {
      fiscalYearObjects[element.cust_id] = element;
    })
    this.setState({ rows, fiscalYearObjects, fiscalYears });
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
    return rows.filter(element => {
      return (!filter.types.length || filter.types.includes(element.status))
        && (filter.cust_id === -1 || element.cust_id === filter.cust_id)
        && (!moment.isMoment(filter.datewise.from) || (moment(element.date) >= filter.datewise.from))
        && (!moment.isMoment(filter.datewise.to) || (moment(element.date) <= filter.datewise.to))
        && (!filter.min || element.netamount >= filter.min)
        && (!filter.max || element.netamount <= filter.max)
    });
  }
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }
  edit = id => {
    this.setState({
      edit: true,
      editRow: id
    })
  }
  editClose = () => {
    this.setState({
      edit: false,
      editRow: 0
    })
  }
  removeBudget = async id => {
    let result = await BudgetService.removeBudget(id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== id
      ));
      this.setState({ rows, edit: false })
    }
  }
  render() {
    const { order, orderBy, page, rowsPerPage, } = this.state;
    // let filterData = this.filtering();
    let filterData = this.state.rows;
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
                  <Typography variant="h6" className="hidden sm:flex">{'All Invoice'}</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                className="normal-case" variant="contained" color="primary" aria-label="Send Message"
                onClick={this.showFilter}>Filter</Button>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper style={{ padding: '1em' }}>
              <Table>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row.id} >
                      <TableCell component="th" scope="row" style={{ width: '20px' }}>{index}</TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.fiscalYear}</TableCell>
                      <TableCell align="left">{intervals[row.interval].label}</TableCell>
                      <TableCell align="left">
                        <IconButton className='color-limegreen' onClick={() => this.edit(row.id)}>
                          <EditAttributes />
                        </IconButton>
                        <IconButton className='color-brown' onClick={() => this.removeBudget(row.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        {'No Budget found.'}
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filterData.length}
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
            {/* {this.state.filter && <FilterDialog
              onClose={this.onFilterDialogClose}
              changeFilter={this.changeFilter}
              filter={this.state.filter}
              customers={customers}
              open={this.state.showFilter} />
            } */}
            <BudgetDialog
              open={this.state.edit}
              editId={this.state.editRow}
              editClose={this.editClose}
              onRemove={this.removeBudget}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(ManagerBudget);
