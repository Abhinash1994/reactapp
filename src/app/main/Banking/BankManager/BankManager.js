import React, { Component } from "react";
import ChartOfAccountService from "../../../services/ChartOfAccountService";
import BankService from "../../../services/BankService";
import {
  withStyles,
  Typography,
  Icon,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@material-ui/core";
import { FusePageSimple, FuseUtils, FuseAnimate } from "@fuse";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import { stableSort, getSorting } from "../../../helper/TableSortHepler";
import BackManagerqDialog from "./BankManagerDialog";
import * as authActions from "app/auth/store/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const tableColumes = [
  { id: "name", numeric: false, disablePadding: true, label: "Bank Name" },
  {
    id: "acc_type",
    numeric: false,
    disablePadding: false,
    label: "Account type",
  },
  {
    id: "acc_number",
    numeric: false,
    disablePadding: false,
    label: "Account Number",
  },
  { id: "branch", numeric: false, disablePadding: false, label: "Branch Name" },
  { id: "swift_code", numeric: false, disablePadding: false, label: "Swift" },
  { id: "level_value", numeric: false, disablePadding: false, label: "Level" },
  { id: "actions", numeric: false, disablePadding: false, label: "" },
];

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

class BankManager extends Component {
  state = {
    searchText: "",
    rows: [],
    order: "asc",
    orderBy: "id",
    account: [],
    branch: [],
  };

  async componentDidMount() {
    let rows = await BankService.getBanks();
    let account = await ChartOfAccountService.getChartOfAccounts("Bank");

    // let branch = await BranchService.getAllBranch();
    if (Array.isArray(rows)) {
      this.setState({ rows, account });
    }
  }

  setSearchText = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleSave = async (row, type) => {
    if (type === "edit") {
      let newBank = await BankService.updateBank(row);
      if (newBank) {
        let rows = await BankService.getBanks();
        this.setState({ rows });
      }
    } else {
      let newBank = await BankService.createBank(row);
      if (newBank) {
        let { rows } = this.state;
        rows.push(newBank);
        this.setState({ rows });
      }
    }
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleRemove = async (row) => {
    let result = await BankService.remvoeBank(row.id);
    if (result) {
      let rows = this.state.rows.filter((element) => element.id !== row.id);
      this.setState({ rows });
    }
  };

  getFilteredArray = (entities, searchText) => {
    const arr = Object.keys(entities).map((id) => entities[id]);
    if (searchText.length === 0) {
      return arr;
    }
    return FuseUtils.filterArrayByString(arr, searchText);
  };

  getBranchName = (id) => {
    let result = this.state.branch.filter(
      (element) => element.branch_Id === id
    );
    if (result.length) {
      return result[0].branch_Name;
    }
    return "";
  };
  getAccountName = (id) => {
    let result = this.state.account.filter((element) => element.id === id);
    if (result.length) {
      return result[0].ledger_name;
    }
    return "";
  };
  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;
    var data = this.getFilteredArray(this.state.rows, this.state.searchText);
    data = stableSort(data, getSorting(order, orderBy));

    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24",
        }}
        header={
          <div className="px-24  pt-sm pb-sm flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Typography variant="h6" className="hidden sm:flex fs-md">
                  Create Bank
                </Typography>
              </FuseAnimate>
            </div>
            <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
              <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Paper
                  className="flex items-center w-full max-w-512 search-box"
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
                      "aria-label": "Search",
                    }}
                    onChange={this.setSearchText}
                  />
                </Paper>
              </FuseAnimate>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24 product-service-page">
            <BackManagerqDialog
              type="add"
              open={false}
              rows={this.state.rows}
              onSave={this.handleSave}
              onRemove={this.handleRemove}
              row={{
                name: "",
                acc_type: "",
                acc_number: "",
                branch: "",
                swift_code: "",
                level_value: "",
                url: "",
              }}
              account={this.state.account}
              branch={this.state.branch}
            />
            <Paper className={`${classes.root} p-16`}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.acc_type}</TableCell>
                      <TableCell align="left">{row.acc_number}</TableCell>
                      <TableCell align="left">{row.branch}</TableCell>
                      <TableCell align="left">{row.swift_code}</TableCell>
                      <TableCell align="left">{row.level_value}</TableCell>
                      <TableCell align="center">
                        <BackManagerqDialog
                          type="edit"
                          rows={this.state.rows}
                          onSave={this.handleSave}
                          onRemove={this.handleRemove}
                          row={row}
                          account={this.state.account}
                          branch={this.state.branch}
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
            </Paper>
          </div>
        }
      ></FusePageSimple>
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

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BankManager)
);
