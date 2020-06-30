import React, { Component } from "react";
import {
  withStyles, Typography, Button, TextField, MenuItem, Menu, Fade, Table, TableBody, TableCell, TableRow, Paper, Grid
} from "@material-ui/core";
import { FusePageSimple, FuseAnimate } from "@fuse";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import EnhancedTableHead from "../../../../../components/EnhancedTableHead";
import { SupervisorAccount } from "@material-ui/icons";
import moment from "moment";
import LabelControl from "../../../../../components/LabelControl";
import utils from "../../../../../helper/utils";
import Variables from "../../../../../../variables";
import ReactExport from "react-data-export";
import { PrintService } from "../../../../../services";
import BranchService from "../../../../../services/BranchService";
import ChartOfAccountService from "../../../../../services/ChartOfAccountService";
import _ from "lodash";

const tableColumes = [
  { id: "sn", numeric: false, disablePadding: true, label: "S.N." },
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "name", numeric: false, disablePadding: true, label: "Party Name" },
  { id: "balance", numeric: false, disablePadding: true, label: "Balance" },
  { id: "mobile", numeric: false, disablePadding: true, label: "Mobile" },
  { id: "action", numeric: false, disablePadding: true, label: "Action"},
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

class Salarypayable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "",
      rows: [],
      page: 0,
      rowsPerPage: 10,
      showFilter: false,
      filter: {
        datewise: {},
        types: [],
        branch: 0,
        charKhataType: 100,
        pageSize: 10,
        pageIndex: 0,
      },
      dateType: "Today",
      exportMenu: null,
      allBranch: [],
    };
    this.ExportPDF = this.ExportPDF.bind(this);
    this.viewData = this.viewData.bind(this);
    this.PrintData = this.PrintData.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  async componentDidMount() {
    this.state.filter.datewise = utils.getDateRange(this.state.dateType);
    let allBranch = await BranchService.getAllBranch();
    this.setState({ allBranch })
  }

  async viewData() {
    let filter = {};
    filter.from =
      this.state.filter.datewise.from === undefined
        ? ""
        : moment(new Date(this.state.filter.datewise.from)).format(
          "YYYY/MM/DD"
        );
    filter.to =
      this.state.filter.datewise.to === undefined
        ? ""
        : moment(new Date(this.state.filter.datewise.to)).format("YYYY/MM/DD");
    filter.BranchId = parseInt(this.state.branch ? this.state.branch : "0");
    filter.Type = parseInt(this.state.charKhataType ? this.state.charKhataType : "100");

    let dataList = await ChartOfAccountService.getSalaryPayableReport(filter);
    await this.setState({ rows: dataList.data });
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  handleBranch = (event) => {
    this.setState({ branch: event.target.value });
  }

  handleCharKhata = (event) => {
    this.setState({ charKhataType: event.target.value });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  ExportPDF() {
    let sum = 0;
    if (this.state.rows.length > 0) {
       sum = _.sumBy(this.state.rows, function (d) {
        return d.balance;
      });

      var row = [];
      row.tr_Id = 0;
      row.ledger_name = "Total";
      row.total = 'Rs.'+sum;
      this.state.rows.push(row);
      PrintService.printAccountpayable(this.state.rows, false, "Salary Payable");
    }
  }

  PrintData() {
    let sum = 0;
    if (this.state.rows.length > 0) {
       sum = _.sumBy(this.state.rows, function (d) {
        return d.balance;
      });

      var row = [];
      row.tr_Id = 0;
      row.ledger_name = "Total";
      row.total = 'Rs.'+sum;
      this.state.rows.push(row);
      PrintService.printAccountpayable(this.state.rows, true, "Salary Payable");
    }
  }

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
  removeSale = (id) => {
    let rows = this.state.rows.filter((element) => element.id !== id);
    this.setState({ rows, edit: false });
  };
  changeDateRange = (name) => (event) => {
    this.setState({
      rows: [],
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

  handleChange = (name) => (event) => {
    this.setState({
      filter: {
        ...this.state.filter,
        [name]: event.target.value,
      },
    });
  };
  render() {
    const { classes } = this.props;
    const { dateTypes } = Variables;
    const {
      order,
      orderBy,
      filter,
      dateType,
      exportMenu,
      allBranch,
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
                    {"Salary Payable"}
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
                        <MenuItem value={element} key={element}>
                          {element}
                        </MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={3}>
                  {moment.isMoment(filter.datewise.to) && (
                    <LabelControl label="To">
                      <TextField
                        type="date"
                        variant="outlined"
                        value={filter.datewise.to.format("YYYY-MM-DD") || ""}
                        onChange={this.changeDateRange("to")}
                      />
                    </LabelControl>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <LabelControl label="Branch">
                    <TextField
                      select
                      fullWidth
                      variant="outlined"
                      value={this.state.branch || 0}
                      onChange={this.handleBranch}
                    >
                      <MenuItem value={0}>All Branch</MenuItem>
                      {
                        allBranch.map((item, index) => (
                          <MenuItem key={index} value={item.branch_Id}>{item.branch_Name}</MenuItem>
                        ))
                      }
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={3} className="flex items-center justify-end">
                  <Button
                    onClick={this.viewData}
                    className="text-transform-none"
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
                  {
                    this.state.rows ? 
                    this.state.rows.map((row, index) => (
                      <TableRow
                        key={row.tr_Id}
                        className="change-row"
                        onClick={() => this.edit(row.id)}
                      >
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">
                          {moment(row.date).format("YYYY-MM-DD HH:mm")}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.balance || "-"}</TableCell>
                        <TableCell align="left">{row.mobile}</TableCell>
                        <TableCell align="left">
                          <Button variant="contained" color="primary" href="#contained-buttons" style={{background:'#3e7786'}}>View</Button>
                          <Button variant="contained" color="primary" href="/statement" style={{background:'#3e7786',marginLeft:'1rem'}}>Send</Button>
  
                        </TableCell>
                      </TableRow>
                    ))
                    :''
                  }
                  
                  {this.state.rows.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={8}>
                        {"No data found."}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell align="right" colSpan={3}>
                      Total
                    </TableCell>
                    <TableCell align="left"><span>Rs.{_.sum(_.map(this.state.rows, d => d.balance))}</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" colSpan={8}>
                      <Button className="text-transform-none" onClick={this.PrintData}>Print</Button>
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
                              label="Party Name"
                              value="name"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Balance"
                              value="balance"
                            />
                            <ReactExport.ExcelFile.ExcelColumn
                              label="Mobile"
                              value="mobile"
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
  connect(mapStateToProps, mapDispatchToProps)(Salarypayable)
);
