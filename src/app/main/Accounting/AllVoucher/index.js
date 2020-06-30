import { FuseAnimate, FusePageSimple } from "@fuse";
import {
  Button,
  Fade,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  withStyles,
  Icon,
  IconButton,
} from "@material-ui/core";
import { SupervisorAccount } from "@material-ui/icons";
import * as authActions from "app/auth/store/actions";
import moment from "moment";
import React, { Component } from "react";
import ReactExport from "react-data-export";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import utils from "../../../helper/utils";
import { PrintService } from "../../../services";
import index from "../../../services/ExcelService/index";
import TransactionService from "../../../services/TransactionService";
import FilterDialog from "./Filter.dialog";
import "./style.scss";
import isEmpty from "app/helper/utils/isEmpty";
import { getVoucherDetails } from "app/store/actions/transaction";
import UserService from "app/services/UserService";

const tableColumns = [
  { id: "sn", numeric: false, disablePadding: true, label: "S.N." },
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  {
    id: "vouc_No",
    numeric: false,
    disablePadding: true,
    label: "Voucher No.",
  },
  {
    id: "remarks",
    numeric: false,
    disablePadding: true,
    label: "Remarks",
  },
  { id: "userName", numeric: false, disablePadding: true, label: "User" },
  {
    id: "debit",
    numeric: false,
    disablePadding: true,
    label: "Amount",
    align: "right",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "",
    align: "right",
  },
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

class AllVoucher extends Component {
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
        fromDate: moment(new Date(utils.getDateRange("Today").from)).format(
          "YYYY/MM/DD"
        ),
        toDate: moment(new Date(utils.getDateRange("Today").to)).format(
          "YYYY/MM/DD"
        ),
        tranType: [],
        userId: 0,
      },
      dateType: "Today",
      exportMenu: null,
      allUsers: [],
    };

    this.PrintData = this.PrintData.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  async componentDidMount() {
    //this.state.filter.datewise = utils.getDateRange(this.state.dateType);
    await this.props.getVoucherDetails(this.state.filter);
    let allUsers = await UserService.getAllUsers();
    this.setState({ allUsers });
    this.setRowValues();
  }

  setRowValues = () => {
    const { voucherDetails } = this.props;
    const totalBalance =
      !isEmpty(voucherDetails.value) &&
      voucherDetails.value.reduce((a, b) => a + (parseInt(b["debit"]) || 0), 0);
    this.setState({ rows: voucherDetails.value, totalBalance });
    console.log(voucherDetails.value);
  };

  showFilter = () => {
    this.setState({ showFilter: true });
  };

  PrintData(print) {
    if (this.state.rows.length > 0) {
      //let dateStr = "";
      // if (
      //   this.state.filter.datewise.from !== undefined &&
      //   this.state.filter.datewise.to !== undefined
      // )
      //   dateStr =
      //     "From " +
      //     moment(this.state.filter.datewise.from).format("YYYY-MM-DD") +
      //     " To " +
      //     moment(this.state.filter.datewise.to).format("YYYY-MM-DD");
      const { rows } = this.state;
      rows.map((x) => (x.date = moment(x.date).format("YYYY-MM-DD")));
      var row = [];
      row.tr_Id = 0;
      row.date = "";
      row.vouch_No = "Total";
      row.remarks = this.state.debit;
      row.userName = "Total";
      row.debit = this.state.totalBalance;
      rows.push(row);
      PrintService.printAllVoucher(
        rows,
        print,
        this.props.user.username,
        moment(new Date()).format("YYYY-MM-DD")
      );
    }
  }

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
  handleShowFilter = (show) => {
    this.setState({ showFilter: show });
  };
  changeFilter = async (filter) => {
    let requestData = {
      fromDate: filter.from,
      toDate: filter.to,
      userId: filter.user,
      tranType: filter.types,
    };
    await this.props.getVoucherDetails(requestData);
    this.setRowValues();
    this.handleShowFilter(false);
  };

  handlePrintRowVoucher = async (voucherNo) => {
    let result = await TransactionService.getVoucherByVoucherNo(voucherNo);
    let printData = result;
    console.log(printData);
    const totalDebit =
      !isEmpty(result) &&
      result.reduce((a, b) => a + (parseInt(b["debit"]) || 0), 0);
    const totalCredit =
      !isEmpty(result) &&
      result.reduce((a, b) => a + (parseInt(b["credit"]) || 0), 0);
    let row = [];
    row.tr_Id = 0;
    row.ledgerName = "Total";
    row.credit = totalCredit;
    row.debit = totalDebit;
    printData.push(row);
    PrintService.printVoucher(
      printData,
      voucherNo,
      this.props.user.username,
      moment(new Date(printData[0].date)).format("YYYY-MM-DD")
    );
  };
  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      filter,
      exportMenu,
      showFilter,
      totalBalance,
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
                    {"All Voucher"}
                  </Typography>
                </FuseAnimate>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                className="normal-case"
                variant="contained"
                color="primary"
                aria-label="Send Message"
                onClick={() => this.handleShowFilter(true)}
              >
                Filter
              </Button>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper className={classes.root} style={{ padding: "1em" }}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumns}
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
                      <TableCell align="left">{row.vouc_No || ""}</TableCell>
                      <TableCell align="left">{row.remarks || ""}</TableCell>
                      <TableCell align="left">{row.userName || ""}</TableCell>
                      <TableCell align="left">{row.debit || "-"}</TableCell>
                      <TableCell align="left">
                        {" "}
                        <IconButton
                          onClick={(ev) => {
                            ev.stopPropagation();
                            this.handlePrintRowVoucher(row.vouc_No);
                          }}
                          className="color-limegreen"
                        >
                          <Icon>print</Icon>
                        </IconButton>
                      </TableCell>
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
                    <TableCell align="right" colSpan={5}>
                      Total
                    </TableCell>
                    <TableCell align="left">{totalBalance}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={7}>
                      <Button
                        className="text-transform-none"
                        onClick={() => this.PrintData(true)}
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
                              label="Voucher No."
                              value="vouc_No"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Remarks"
                              value="remarks"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="User"
                              value="userName"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Amount"
                              value="debit"
                            />
                          </ReactExport.ExcelFile.ExcelSheet>
                        </ReactExport.ExcelFile>
                        <MenuItem onClick={() => this.PrintData(false)}>
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
            <FilterDialog
              onClose={this.handleShowFilter}
              changeFilter={this.changeFilter}
              filter={filter}
              userId={this.props.user.id}
              open={showFilter}
              allUsers={this.state.allUsers}
            />
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
      getVoucherDetails,
    },
    dispatch
  );
}

function mapStateToProps({ auth, transactionReducer }) {
  return {
    user: auth.user,
    voucherDetails: transactionReducer.voucherDetails,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(AllVoucher)
);
