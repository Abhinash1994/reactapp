import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationManager } from 'react-notifications';
import {
  withStyles, Typography, Icon, Button,
  Table, TableBody, TableCell, TableRow, Paper, TablePagination
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { FusePageSimple, FuseAnimate } from '@fuse';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import EditDialog from './Edit.Dialog'
import FilterDialog from './Filter.Dialog'
import './style.scss'
import ChartOfAccountService from '../../services/ChartOfAccountService';
const tableColumes = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '20px' },
  { id: 'mast_Code', numeric: false, disablePadding: true, label: 'Mast Code' },
  { id: 'ledger_Group', numeric: false, disablePadding: true, label: 'Ledger Group' },
  { id: 'ledger_name', numeric: false, disablePadding: false, label: 'Ledger Name', width: '250px' },
  { id: 'is_ledger', numeric: false, disablePadding: false, label: 'Ledger', width: '100px' },
  { id: 'is_subledger', numeric: false, disablePadding: false, label: 'SubLedger', width: '100px' },
  { id: 'actions', numeric: false, disablePadding: false, label: '', width: '50px' },
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

class ChartOfAccount extends Component {

  state = {
    order: 'asc',
    orderBy: 'name',
    rows: [],
    editRow: 0,
    page: 0,
    rowsPerPage: 10,
    mastGroup: ['Assets', 'Liabities', 'Income', 'Expenses'],
    showFilter: false,
    filter: {
      group_name: '',
      types: []
    },
    ledgerGroup: [],
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await ChartOfAccountService.getAllChartOfAccount();
    let ledgerGroup = await ChartOfAccountService.getAccoutLedgerNameList();
    this.setState({ rows, ledgerGroup });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  handleSave = async (row, type) => {
    if (type === 'edit') {
      let newData = await ChartOfAccountService.updateChartOfAccount();
      if (!!newData) {
        let rows = await ChartOfAccountService.getChartOfAccounts();
        this.setState({ rows });
        NotificationManager.error("Successful updated", "Update");
      }
    } else {
      if (row.is_group) {
        await ChartOfAccountService.CreateAccount(row);
        NotificationManager.error("Successful created", "Create");
      }
      else {
        let newData = await ChartOfAccountService.createChartOfAccount(row);
        if (newData) {
          let rows = this.state.rows;
          rows.push(newData);
          this.setState({ rows });
          NotificationManager.error("Successful created", "Create");
        }
      }
    }
  }

  handleRemove = async row => {
    let result = await ChartOfAccountService.remvoeChartOfAccount(row.id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== row.id
      ));
      this.setState({ rows });
      NotificationManager.error("Successful removed", "Remove");
    }
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }
  showFilter = () => {
    this.setState({ showFilter: true });
  }
  filtering = () => {
    let { rows, filter } = this.state;
    let total = 0;
    let result = rows.filter(element => {
      let flag = (!filter.types.length || filter.types.includes(element.mast_Code))
      if (flag) {
        total += element.total;
      }
      return flag;
    });
    return { result, total };
  }
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }
  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage, mastGroup, ledgerGroup } = this.state;
    let filterData = this.filtering(this.state.rows).result;
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
                  <Icon className="text-32 mr-12">formart_list</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Chart of Account'}</Typography>
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
          <div className="p-16 sm:p-24 ">
            <EditDialog type='add' onSave={this.handleSave}
              ledgerGroup={ledgerGroup}
              onRemove={this.handleRemove} row={{
                mast_Code: '',
                ledger_Code: '',
                ledger_Group: 0,
                ledger_name: 0,
                is_ledger: false,
                is_subledger: false,
                is_group: false
              }} />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) =>{ 
                    console.log('row: ',row)
                    return (
                                      <TableRow key={row.id}>
                                        <TableCell align='left'>{index + 1}</TableCell>
                                        <TableCell align='left'>{row.mast_Code ? mastGroup[(row.mast_Code / 100)-1] : ''}</TableCell>
                                        <TableCell align='left'>{row.group_name || 0}</TableCell>
                                        <TableCell align='left'>{row.ledger_name || 0}</TableCell>
                                        <TableCell align='left'>{row.is_ledger && <Check />}</TableCell>
                                        <TableCell align='left'>{row.is_subledger && <Check />}</TableCell>
                                        <TableCell align='left'>
                                          <EditDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                                        </TableCell>
                                      </TableRow>
                                    )
                  }
                  )}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left' colSpan={6}>
                        {'No auto numer list found.'}
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
            {this.state.filter && <FilterDialog
              onClose={this.onFilterDialogClose}
              changeFilter={this.changeFilter}
              filter={this.state.filter}
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
  console.log(auth)
  console.log(auth.user)
  return {
    user: auth.user
  }
}
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ChartOfAccount));
