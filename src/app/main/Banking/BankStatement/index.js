import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Button,
  TextField,
  MenuItem,
  Menu,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Grid,
} from "@material-ui/core";
import { FusePageSimple, FuseAnimate } from "@fuse";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import moment from "moment";
import LabelControl from "../../../components/LabelControl";
import utils from "../../../helper/utils";
import Variables from "../../../../variables";
import TransactionService from "../../../services/TransactionService";
import { BankService, PrintService } from "../../../services";
import ReactExport from "react-data-export";

const tableColumes = [
  { id: "sn", numeric: false, disablePadding: true, label: "S.N." },
  { id: "dateBs", numeric: false, disablePadding: true, label: "Date BS" },
  { id: "dateAd", numeric: false, disablePadding: true, label: "Date Ad." },
  { id: "tansNo", numeric: false, disablePadding: true, label: "Trans No." },
  { id: "remarks", numeric: false, disablePadding: true, label: "Remarks" },
  { id: "debit", numeric: false, disablePadding: true, label: "Debit" },
  { id: "credit", numeric: false, disablePadding: true, label: "Credit" },
  { id: "balance", numeric: false, disablePadding: true, label: "Balance" },
];

const styles = (theme) => ({
  layoutHeader: {
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down("md")]: {
      height: 240,
      minHeight: 240,
    },
  },
});

class BankStatementPage extends Component {
  Allbanktext = "Select Bank";

  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "",
      rows: [],
      banks: [],
      transactionlist: [],
      page: 0,
      rowsPerPage: 10,
      showFilter: false,
      debit: 0,
      credit: 0,
      filter: {
        datewise: {},
        types: [],
      },
      fromData: null,
      toDate: null,
      dateType: "All dates",
      bank: 0,
      exportMenu: null,
    };
    this.displayfilteredData = this.displayfilteredData.bind(this);
    this.displayData = this.displayData.bind(this);
    this.setDefaultValues = this.setDefaultValues.bind(this);
    this.PrintExportPdf = this.PrintExportPdf.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  async displayData() {
    await this.getSatementListData();
    let { rows } = this.state;
    this.state.transactionlist.forEach((element) => {
      let bal = element.debit - element.credit;
      // var pRowBal = rows.length===0 ? 0 : rows[rows.length - 1].balance;
      // if (pRowBal >= 0)
      element.balance += bal;
      // else
      // element.balance = pRowBal - bal;

      rows.push(element);
    });
    this.setState({ rows });
  }

  async componentDidMount() {
    this.state.bank = this.Allbanktext;
    this.state.dateType = "This year";
    this.state.filter.datewise = utils.getDateRange(this.state.dateType);
    await this.getBankList();
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.setState({
      bank: this.Allbanktext,
    });
  }

  async getSatementListData() {
    let { transactionlist } = this.state;
    let tList = await TransactionService.getTransactions();
    tList.forEach((element) => {
      transactionlist.push(element);
    });
    this.setState({ transactionlist });
  }

  async getBankList() {
    let { banks } = this.state;
    let bankList = await BankService.getBanks();
    let Ibank = [];
    Ibank.id = 0;
    Ibank.ledger_code = 0;
    Ibank.name = this.Allbanktext;
    Ibank.selected = true;
    banks.push(Ibank);

    bankList.forEach((row, index) => {
      let bank = [];
      bank.id = row.id;
      bank.ledger_code = row.ledger_code;
      bank.name = row.name;
      bank.selected = false;
      banks.push(bank);
    });
    this.setState({ banks });
  }

  async PrintExportPdf(print) {
    let { rows } = this.state;
    let dateStr = "";
    if (
      this.state.filter.datewise.from !== undefined &&
      this.state.filter.datewise.to !== undefined
    )
      dateStr =
        "From " +
        moment(this.state.filter.datewise.from).format("YYYY-MM-DD") +
        " To " +
        moment(this.state.filter.datewise.to).format("YYYY-MM-DD");
    PrintService.printBankStatement(
      rows,
      print,
      dateStr,
      this.state.bank,
      this.props.user.username
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  showFilter = () => {
    this.setState({ showFilter: true });
  };
  filtering = () => {
    let { rows, filter } = this.state;
    let total = 0;
    let result = rows.filter((element) => {
      let flag =
        (!filter.types.length || filter.types.includes(element.status)) &&
        (!moment.isMoment(filter.datewise.from) ||
          moment(element.date) >= filter.datewise.from) &&
        (!moment.isMoment(filter.datewise.to) ||
          moment(element.date) <= filter.datewise.to);
      if (flag) {
        total += element.total;
      }
      return flag;
    });
    return { result, total };
  };

  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  };

  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  };

  edit = (id) => {
    this.setState({
      edit: true,
      editRow: id,
    });
  };

  editClose = () => {
    this.setState({
      edit: false,
      editRow: 0,
    });
  };

  removeSale = (id) => {
    let rows = this.state.rows.filter((element) => element.id !== id);
    this.setState({ rows, edit: false });
  };
  changeDateRange = (name) => (event) => {
    this.setState({
      dateType: "Custom",
      filter: {
        ...this.state.filter,
        datewise: {
          ...this.state.filter.datewise,
          [name]: moment(event.target.value),
        },
      },
    });
  };

  changeDate = (event) => {
    this.setState({
      dateType: event.target.value,
      filter: {
        ...this.state.filter,
        datewise: utils.getDateRange(event.target.value),
      },
    });
  };

  changeBank = (event) => {
    let current = event.target.value;

    if (current === this.Allbanktext) {
      let { rows } = this.state;
      rows = [];
      this.setState({ rows });
      this.state.transactionlist.forEach((element) => {
        rows.push(element);
      });
      this.setState({ rows });
      return;
    }

    let selectedBank = this.state.banks.filter((x) => x.name === current);
    let filteredData = this.state.transactionlist.filter(
      (r) => r.ledger_Code === selectedBank[0].ledger_code
    );
    let { rows } = this.state;
    rows = [];
    this.setState({ rows });
    filteredData.forEach((element) => {
      rows.push(element);
    });
    this.setState({ rows, bank: current });
  };

  displayfilteredData = async () => {
    let { rows } = this.state;
    rows = [];

    if (this.state.bank === this.Allbanktext) {
      alert("Please select one bank");
      return;
    }

    var bk = this.state.banks.filter((x) => x.name === this.state.bank);
    let filter = {};
    filter.ledger_code = bk[0].ledger_code;
    filter.from = this.state.filter.datewise.from;
    filter.to = this.state.filter.datewise.to;
    var data = await TransactionService.getFilterTransactions(filter);

    data.forEach((element) => {
      rows.push(element);
    });
    this.setState({ rows });
  };

  handelExport = (event) => {
    this.setState({
      exportMenu: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      exportMenu: null,
    });
  };

  render() {
    const { classes } = this.props;
    const { dateTypes } = Variables;
    const { order, orderBy, filter, dateType, exportMenu } = this.state;
    let data = this.state.rows;
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24",
        }}
        header={
          <div className="px-24  pt-sm pb-sm flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex fs-md">
                    {"Bank Statement"}
                  </Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper
              className={`${classes.root} mb-16`}
              style={{ padding: "1em" }}
            >
              <Grid container>
                <Grid item xs={2}>
                  <LabelControl label="Bank">
                    <TextField
                      select
                      variant="outlined"
                      value={this.state.bank || ""}
                      onChange={this.changeBank}
                      width="200px"
                    >
                      {this.state.banks.map((element, index) => (
                        <MenuItem
                          key={index}
                          value={element.name}
                          selected={element.selected}
                        >
                          {element.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={2}>
                  <LabelControl label="Date">
                    <TextField
                      select
                      variant="outlined"
                      value={dateType || ""}
                      onChange={this.changeDate}
                    >
                      {dateTypes.map((element, index) => (
                        <MenuItem value={element} key={index}>
                          {element}
                        </MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={3}>
                  {filter.datewise.from !== "" && (
                    <LabelControl label="From">
                      <TextField
                        type="date"
                        variant="outlined"
                        value={
                          filter.datewise.from === undefined
                            ? ""
                            : filter.datewise.from.format("YYYY-MM-DD")
                        }
                        onChange={this.changeDateRange("from")}
                      />
                    </LabelControl>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {filter.datewise.to !== "" && (
                    <LabelControl label="To">
                      <TextField
                        type="date"
                        variant="outlined"
                        value={
                          filter.datewise.to === undefined
                            ? ""
                            : filter.datewise.to.format("YYYY-MM-DD")
                        }
                        onChange={this.changeDateRange("to")}
                      />
                    </LabelControl>
                  )}
                </Grid>
                <Grid item xs={2} className="flex items-center justify-end">
                  <Button
                    className="text-transform-none"
                    onClick={() => this.displayfilteredData()}
                  >
                    View
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            <Paper className={classes.root} style={{ padding: "1em" }}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow
                      key={row.tr_id}
                      className="change-row"
                      onClick={() => this.edit(row.id)}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        {moment(row.date).format("MM-DD-YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.date).format("MM-DD-YYYY")}
                      </TableCell>
                      <TableCell align="left">{row.trans_id || ""}</TableCell>
                      <TableCell align="left">{row.remark || ""}</TableCell>
                      <TableCell align="left">
                        {row.debit === 0 ? "-" : row.debit}
                      </TableCell>
                      <TableCell align="left">
                        {row.credit === 0 ? "-" : row.credit}
                      </TableCell>
                      <TableCell align="left">{row.balance}</TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={8}>
                        {"No Bank statement found."}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell align="right" colSpan={8}>
                      <Button
                        className="text-transform-none"
                        onClick={() => this.PrintExportPdf(true)}
                      >
                        Print
                      </Button>
                      <Button
                        className="text-transform-none"
                        aria-controls="export-menu"
                        aria-haspopup="true"
                        onClick={this.handelExport}
                      >
                        {"Export"}
                      </Button>
                      <Menu
                        id="export-menu"
                        anchorEl={exportMenu}
                        keepMounted
                        open={Boolean(exportMenu)}
                        onClose={this.handleMenuClose}
                        TransitionComponent={Fade}
                      >
                        <ReactExport.ExcelFile
                          element={<MenuItem>Excel</MenuItem>}
                        >
                          <ReactExport.ExcelFile.ExcelSheet
                            data={data}
                            name="Bank Statement"
                          >
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Date"
                              value="date"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Trans No."
                              value="trans_id"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Remark"
                              value="remark"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Debit"
                              value="debit"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Credit"
                              value="credit"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Balance"
                              value="balance"
                            />
                          </ReactExport.ExcelFile.ExcelSheet>
                        </ReactExport.ExcelFile>
                        {/* <MenuItem onClick={this.handleMenuClose}>
                          Excel
                        </MenuItem> */}
                        <MenuItem onClick={() => this.PrintExportPdf(false)}>
                          PDF
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* <TablePagination
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
              /> */}
            </Paper>
          </div>
        }
      />
    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: authActions.logoutUser,
    },
    dispatch
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(BankStatementPage)
);
