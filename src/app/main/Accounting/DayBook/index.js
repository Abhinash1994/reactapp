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
import { SupervisorAccount } from "@material-ui/icons";
import moment from "moment";
import LabelControl from "../../../components/LabelControl";
import utils from "../../../helper/utils";
import Variables from "../../../../variables";
import TransactionService from "../../../services/TransactionService";
import { PrintService } from "../../../services";
import index from "../../../services/ExcelService/index";
import ReactExport from "react-data-export";

const tableColumes = [
  { id: "sn", numeric: false, disablePadding: true, label: "S.N." },
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "tran_no", numeric: false, disablePadding: true, label: "Tran No." },
  {
    id: "ledger_name",
    numeric: false,
    disablePadding: true,
    label: "Ledger Name",
  },
  { id: "debit", numeric: false, disablePadding: true, label: "Debit" },
  { id: "credit", numeric: false, disablePadding: true, label: "Credit" },
  { id: "Remarks", numeric: false, disablePadding: true, label: "Remarks" },
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

class SaleReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "",
      rows: [],
      page: 0,
      rowsPerPage: 10,
      showFilter: false,
      debit: 0,
      credit: 0,
      filter: {
        datewise: {},
        types: [],
      },
      dateType: "Today",
      exportMenu: null,
    };
    this.ExportPDF = this.ExportPDF.bind(this);
    this.viewTransactions = this.viewTransactions.bind(this);
    this.PrintData = this.PrintData.bind(this);
    this.displayResponse = this.displayResponse.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  getDayBook = async () => {
    let Btrans = await TransactionService.getDayBook();
    let { rows, debit, credit } = this.state;
    Btrans.forEach((element) => {
      let tr = [];
      tr.tr_Id = element.Tr_Id;
      tr.date = element.date;

      tr.trans_Id = element.trans_Id;
      tr.ledger_name = element.ledger_name;
      tr.debit = element.debit;
      tr.credit = element.credit;
      tr.remarks = element.remarks;
      debit = debit + tr.debit;
      credit = credit + tr.credit;
      rows.push(tr);
    });
    this.setState({ rows, debit, credit });
  };

  async componentDidMount() {
    this.state.filter.datewise = utils.getDateRange(this.state.dateType);
  }

  async viewTransactions() {
    let filter = {};
    filter.type = "bank";
    filter.from =
      this.state.filter.datewise.from === undefined
        ? ""
        : this.state.filter.datewise.from;
    filter.to =
      this.state.filter.datewise.to === undefined
        ? ""
        : this.state.filter.datewise.to;
    var dataList = await TransactionService.getBookTransactions(filter);
    await this.displayResponse(dataList);
  }

  async displayResponse(dataList) {
    let { rows, debit, credit } = this.state;
    rows = [];
    debit = 0;
    credit = 0;
    dataList.forEach((element) => {
      debit += element.debit;
      credit += element.credit;
      rows.push(element);
    });
    this.setState({ rows, debit, credit });
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
    let { rows, filter, dateType } = this.state;
    let total = 0;
    filter.datewise = utils.getDateRange(dateType);
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

  ExportPDF() {
    if (this.state.rows.length > 0) {
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
      var row = [];
      row.tr_Id = 0;
      row.date = "";
      row.ledger_name = "Total";
      row.debit = this.state.debit;
      row.credit = this.state.credit;
      this.state.rows.push(row);
      PrintService.printDaybook(this.state.rows, false, dateStr, "Day Book");
    }
  }

  PrintData() {
    if (this.state.rows.length > 0) {
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
      var row = [];
      row.date = "";
      row.ledger_name = "Total";
      row.debit = this.state.debit;
      row.credit = this.state.credit;
      this.state.rows.push(row);
      PrintService.printDaybook(this.state.rows, true, dateStr, "Day Book");
    }
  }

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
      rows: [],
      dateType: event.target.value,
      filter: {
        ...this.state.filter,
        datewise: utils.getDateRange(event.target.value),
      },
    });
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
    index.example();
  };

  render() {
    const { classes } = this.props;
    const { dateTypes } = Variables;
    const {
      order,
      orderBy,
      debit,
      credit,
      filter,
      dateType,
      exportMenu,
    } = this.state;
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24",
        }}
        header={
          <div className="px-24 pt-sm pb-sm flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <SupervisorAccount className="text-32 mr-12" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex fs-md">
                    {"Day Book"}
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
                <Grid item xs={3}>
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
                <Grid item xs={3} className="flex items-center justify-end">
                  <Button
                    className="text-transform-none"
                    onClick={this.viewTransactions}
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
                  {this.state.rows.map((row, index) => (
                    <TableRow
                      key={row.tr_Id}
                      className="change-row"
                      onClick={() => this.edit(row.id)}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        {moment(row.date).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell align="left">{row.trans_Id || ""}</TableCell>
                      <TableCell align="left">
                        {row.ledger_name || ""}
                      </TableCell>
                      <TableCell align="left">{row.debit || "-"}</TableCell>
                      <TableCell align="left">{row.credit || "-"}</TableCell>
                      <TableCell align="left">{row.remarks}</TableCell>
                    </TableRow>
                  ))}
                  {this.state.rows.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        {"No voucher found."}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell align="right" colSpan={4}>
                      Total
                    </TableCell>
                    <TableCell align="left">{debit}</TableCell>
                    <TableCell align="left">{credit}</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={7}>
                      <Button
                        className="text-transform-none"
                        onClick={this.PrintData}
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
                            data={this.state.rows}
                            name="Employees"
                          >
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Date"
                              value="date"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Trans"
                              value="trans_Id"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Ledger"
                              value="ledger_name"
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
                              label="Remarks"
                              value="remarks"
                            />
                          </ReactExport.ExcelFile.ExcelSheet>
                        </ReactExport.ExcelFile>
                        <MenuItem onClick={this.ExportPDF}>PDF</MenuItem>
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
  connect(mapStateToProps, mapDispatchToProps)(SaleReportPage)
);
