import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BankService from '../../../services/BankService'
import {
  withStyles, Typography, Icon, Input, TablePagination,
  Table, TableBody, TableCell, TableRow, Paper,
  Grid, TextField, MenuItem, Button
} from "@material-ui/core";
import {  FuseAnimate } from "@fuse";
import Validations from '../../../helper/Validations'
import { NotificationManager } from 'react-notifications';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../../helper/TableSortHepler';
import TransactionDialog from "./Transaction.Dialog";
import moment from "moment";
import './style.scss'
const tableColumes = [
  { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'trans_Id', numeric: false, disablePadding: false, label: 'Tran No' },
  { id: 'remakers', numeric: false, disablePadding: false, label: 'Remarks' },
  { id: 'debit', numeric: true, disablePadding: false, label: 'Amount' },
];

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class BankTransaction extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    searchText: '',
    rows: [],
    editRow: {},
    banks: [],
    order: "asc",
    orderBy: "id",
    account: [],
    branch: [],
    bankType: 'diposit',
  };
  async componentDidMount() {
    let bankType = this.props.location.pathname.endsWith("Deposit") ? 'debit' : 'credit';
    console.log(this.props.match.params, bankType);
    let rows = await BankService.getTransactions(bankType);
    let banks = await BankService.getBanks();
    if (Array.isArray(rows)) {
      this.setState({ rows, banks, bankType });
    }
  }

  setSearchText = event => {
    this.setState({ searchText: event.target.value });
  };
  saveEdit = () => {
    const row = this.state.editRow;
    if (!Validations.IntegerValidation(row.ledger_Code)) {
      NotificationManager.error("Please select bank type!", "ledger_Code");
    } else if (!Validations.IntegerValidation(row.account)) {
      NotificationManager.error("Amount is double!", "Deposit Amont");
    } else if (row.remarks === '') {
      NotificationManager.error("Please enter remarks!", "Remarks");
    } else {
      this.handleSave(row, 'edit');
    }

  }
  handleSave = async (row, type) => {
    if (type === "edit") {
      let newBank = await BankService.updateTransation(row);
      if (newBank) {
        let rows = this.state.rows;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].tr_Id === row.tr_Id) {
            rows[i] = row;
            break;
          }
        }
        let row1 = this.state.rows;
        this.setState({ rows });
      }
    } else {
      let newBank = await BankService.createTransaction(row);
      if (newBank) {
        let { rows } = this.state;
        rows.push(newBank);
        this.setState({ rows });
      }
    }
  };
  cancelEdit = () => {
    this.setState({
      editRow: {}
    })
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleRemove = async row => {
    let result = await BankService.remvoeTransaction(row.tr_Id);
    if (result) {
    let rows = this.state.rows.filter(element => (
      element.tr_Id !== row.tr_Id
    ));
    this.setState({ rows });
    }
  };

  getBranchName = id => {
    let result = this.state.branch.filter(element => (element.branch_Id === id));
    if (result.length) {
      return result[0].branch_Name
    }
    return '';
  }
  getAccountName = id => {
    let result = this.state.account.filter(element => (element.id === id));
    if (result.length) {
      return result[0].ledger_name
    }
    return '';
  }
  filtering = () => {
    let { rows, searchText } = this.state;
    let search = searchText.toLowerCase();
    return rows.filter(element => {
      // return true
      return (element.date.toLowerCase().includes(search)
        || element.remarks.toLowerCase().includes(search))
      //   && (!filter.roles.length || filter.roles.includes(element.roll_Id))
      //   && (!filter.branchs.length || filter.branchs.includes(element.branch_Id))
    });
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }
  editRow = row => {
    this.setState({
      editRow: { ...row }
    })
  }

  handleChange = name => event => {
    var cursor = { ...this.state.editRow };
    cursor[name] = event.target.value;
    this.setState({ editRow: cursor });
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage, banks, bankType, editRow } = this.state;
    let filterData = this.filtering();
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <div className='bank-transaction-page'>
        <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
          <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography className="md:ml-24" variant="h4" color="inherit">
                {`Bank ${bankType === 'debit' ? 'Deposit' : 'Withdraw'}`}
              </Typography>
            </FuseAnimate>
          </div>
          <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Paper
                className="flex p-4 items-center w-full max-w-512 px-8 py-4"
                elevation={1}
              >
                <Icon className="mr-8" color="action">
                  search
                </Icon>
                <Input
                  placeholder="Search for anything"
                  className="flex flex-1"
                  disableUnderline
                  fullWidth
                  value={this.state.searchText}
                  inputProps={{
                    "aria-label": "Search"
                  }}
                  onChange={this.setSearchText}
                />
              </Paper>
            </FuseAnimate>
          </div>
          <TransactionDialog type="add" open={false}
            onSave={this.handleSave}
            onRemove={this.handleRemove}
            banks={banks}
            bankType={bankType}
            row={{
              trans_Id: 1,
              ledger_Code: 1,
              debit: 0,
              credit: 0,
              gi_type: "gi_type",
              remarks: 'remarks',
              narration: 'naration',
              status: true,
              vouc_No: "3",
              fiscal: '1',
              date: '2019-11-8',
              tran_type: 'tran_type',
              branch_id: 1,
              project_id: 1
            }}
            account={this.state.account} branch={this.state.branch}
          />
        </div>
        <Paper className={`${classes.root} p-6 m-6`}>
          <Table className={classes.table}>
            <EnhancedTableHead
              rows={tableColumes}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.map(row => (
                  <TableRow key={row.tr_Id} onClick={() => this.editRow(row)} className='pointer'>
                    <TableCell align="left">{moment(row.date).format('YYYY-MM-DD')}</TableCell>
                    <TableCell align="left">{row.trans_Id}</TableCell>
                    <TableCell align="left">{row.remarks}</TableCell>
                    <TableCell align="left">{bankType === 'debit' ? row.debit : row.credit}</TableCell>
                    <TableCell align="center">
                      <TransactionDialog
                        type="edit"
                        onSave={this.handleSave}
                        bankType={bankType}
                        onRemove={this.handleRemove}
                        banks={banks}
                        row={row}
                        account={this.state.account} branch={this.state.branch}
                      />
                    </TableCell>
                  </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell align="center">No Bank.</TableCell>
                </TableRow>
              )}
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
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // logout: authActions.logoutUser
  }, dispatch);
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BankTransaction));

// export default withStyles(styles)(BankManager);
