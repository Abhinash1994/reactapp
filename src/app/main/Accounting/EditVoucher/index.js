import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  withStyles,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import * as authActions from "app/auth/store/actions";
import AutoSelect from "app/components/Common/AutoSelect";
import ProjectService from "app/services/ProjectService";
import moment from "moment";
import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import LabelControl from "../../../components/LabelControl";
import utils from "../../../helper/utils";
import Validations from "../../../helper/Validations";
import BranchService from "../../../services/BranchService";
import ChartOfAccountService from "../../../services/ChartOfAccountService";
import PrintService from "../../../services/PrintService";
import TransactoinService from "../../../services/TransactionService";
import "./EditVoucher.css";

const tableColumes = [
  { id: "no", numeric: false, disablePadding: true, label: "#", width: "20px" },
  {
    id: "ledgerName",
    numeric: false,
    disablePadding: true,
    label: "Ledger Name",
    width: "250px",
  },
  {
    id: "debit",
    numeric: false,
    disablePadding: true,
    label: "Debit",
    width: "150px",
  },
  {
    id: "credit",
    numeric: false,
    disablePadding: true,
    label: "Credit",
    width: "150px",
  },
  { id: "naration", numeric: false, disablePadding: true, label: "Naration" },
  // { id: "remarks", numeric: false, disablePadding: true, label: "Remarks" },
  {
    id: "action1",
    numeric: false,
    disablePadding: true,
    label: "",
    width: "50px",
  },
  {
    id: "action2",
    numeric: false,
    disablePadding: true,
    label: "",
    width: "50px",
  },
];

const styles = (theme) => ({
  layoutHeader: {
    // height: 320,
    // minHeight: 320,
    [theme.breakpoints.down("md")]: {
      // height: 240,
      // minHeight: 240
    },
  },
});

const Arrays = (data, fieldName, fieldValue) => {
  let arrayItem = [];
  if (data && Array.isArray(data)) {
    data.map((item, key) => {
      arrayItem.push({ label: item[fieldName], value: item[fieldValue] });
      return null;
    });
  }
  return arrayItem;
};

const getAutoSelectValue = (data, value) => {
  let selectedData = data.find((x) => x.value === value);
  return {
    label: selectedData && selectedData.label,
    value: value,
  };
};
class EditVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "cust_id",
      editRow: 0,
      rows: [],
      branchs: [],
      chartOfacc: [],
      chartOfaccObject: {},
      changed: false,
      journalmast: {
        id: 0,
        date: moment(),
        branchId: 0,
        Trans_Id: 1, //one for that voucher(auto+1)
        ledger_Code: 1, // ledger code of each ro
        ledgerName: "",
        Debit: 0,
        Credit: 0,
        Gl_type: "", // gl_type from chartofacc of each ledger
        Remarks: "",
        Narration: "",
        VoucherNo: "",
        mast_Code: 0,
      },
      total: 0,
      debit: 0,
      credit: 0,
      projects: [],
      selectedProject: {},
    };
    this.addNewRow = this.addNewRow.bind(this);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  // componentWillUnmount() {
  //   debugger;
  //   this.addNewRow();
  // }

  createNewRow = () => {
    let { rows } = this.state;
    let row = {
      tr_Id: 0,
      trans_Id: 0,
      tran_type: this.props.tran_type,
      ledgerName: "",
      debit: 0,
      credit: 0,
      naration: "",
      remarks: "",
      VoucherNo: this.state.journalmast.VoucherNo,
      project_id: rows.length > 0 ? rows[0].project_id : 0,
    };

    rows.push(row);
    this.setState({ rows });
    this.countTotals();
  };

  countTotals = () => {
    let { rows, debit, credit } = this.state;
    debit = 0;
    credit = 0;
    rows.forEach((element) => {
      debit += element.debit;
      credit += element.credit;
    });
    this.setState({
      debit,
      credit,
    });
  };

  async componentDidMount() {
    const branchs = await BranchService.getAllBranch();
    const chartOfacc = await ChartOfAccountService.getChartOfAccountsa(
      this.props.tran_type
    );
    const projects = await ProjectService.getAllProjects();
    let chartOfaccObject = {};
    chartOfacc.forEach((element) => {
      chartOfaccObject[element.ledger_Code] = element;
    });
    await this.getVoucherNo();
    this.setState({
      branchs,
      chartOfacc,
      chartOfaccObject,
      projects,
    });

    if (this.props.editId) {
    } else {
      this.createNewRow();
    }
  }

  getVoucherNo = async () => {
    const VoucherNo = await TransactoinService.GetVoucherNumber(
      this.props.tran_type
    );
    let { journalmast } = this.state;
    journalmast.VoucherNo = VoucherNo;
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleSave = async () => {
    if (!this.checkBeforeSave()) {
      NotificationManager.error(
        "Please check your input details",
        "Input Error"
      );
      return;
    }

    let { rows, debit, credit } = this.state;

    if (debit !== credit) {
      NotificationManager.error(
        "Debit and Credit must be equal.",
        "Input Error"
      );
      return;
    }

    rows = rows.filter((element, rowIndex) => element.ledger_Code);

    if (this.props.tran_type === "PV" || this.props.tran_type === "RV") {
      var cRow = rows.filter((x) => x.mast_Code === 100);
      if (cRow.length === 0) {
        NotificationManager.error("you must be add one entry for cash or bank");
        return;
      }
    }

    if (window.confirm(`you want to save this voucher?`)) {
      await TransactoinService.createVoucher(rows);

      NotificationManager.success(
        "Successfully create invoice",
        "Create Invoice"
      );
    }
    setTimeout(async () => {
      if (window.confirm(`you want to print this voucher?`)) {
        await this.PrintData(rows);
      }
    }, 1000);

    await this.getVoucherNo();
    this.setState({
      rows: [],
      editRow: 0,
    });
    this.createNewRow();
  };

  async PrintData(printData) {
    var row = [];
    row.tr_Id = 0;
    row.ledgerName = "Total";
    row.debit = this.state.debit;
    row.credit = this.state.credit;
    printData.push(row);
    PrintService.printVoucher(
      printData,
      this.state.journalmast.VoucherNo,
      this.props.user.username,
      moment(this.state.journalmast.date).format("YYYY-MM-DD")
    );
  }

  checkBeforeSave = () => {
    let { rows } = this.state;
    let result = true;
    rows.forEach((row, index) => {
      if (index < row.length - 1) {
        if (!row.item_id || !row.qty || !row.price) {
          result = false;
          return;
        }
      }
    });
    return result;
  };

  handleRemove = async (row) => {};

  removeDetail = async (index) => {
    let { rows } = this.state;
    rows = rows.filter((element, rowIndex) => rowIndex !== index);
    this.setState({ rows, editRow: this.state.rows.length - 2 });

    if (rows.length === 0) {
      this.createNewRow();
      return;
    }
    this.countTotals();
  };

  async addNewRow(index) {
    let { rows } = this.state;
    if (!rows[index]) {
      NotificationManager.error("Please Select Ledger first.");
      return;
    }
    if (rows[index].credit <= 0 && rows[index].debit <= 0) {
      NotificationManager.error("Please add credit or debit.");
      return;
    }
    //if (rows.length < 2) {
    await this.createNewRow();
    this.setState({ editRow: this.state.editRow + 1 });
    //}
    this.countTotals();
  }

  handleJournalMastChange = (name) => (event) => {
    switch (name) {
      default:
        this.setState({
          journalmast: {
            ...this.state.journalmast,
            [name]: event.target.value,
          },
        });
    }
    if (name === "tax")
      this.caculationTable(this.state.rows, event.target.value);
    this.setState({ changed: true });
  };
  handleDetailChange = (name) => (event) => {
    let { rows, editRow, productObjects } = this.state;
    rows[editRow][name] = event.target.value;
    if (name === "item_id") {
      rows[editRow].price = productObjects[rows[editRow].item_id].s_price;
      rows[editRow].vat = productObjects[rows[editRow].item_id].taxtype;
    } else if (name === "debit") {
      rows[editRow].credit = 0;
    } else if (name === "credit") {
      rows[editRow].debit = 0;
    } else if (name === "ledger_Code") {
      rows[editRow].ledgerName = this.state.chartOfaccObject[
        event.target.value
      ].ledger_name;
      rows[editRow].mast_Code = this.state.chartOfaccObject[
        event.target.value
      ].mast_Code;
    } else if (name === "remarks") {
      rows.map((x) => {
        x.remarks = event.target.value;
        return null;
      });
    }

    this.caculationTable(rows);
    this.setState({ changed: true });
  };

  caculationTable = (rows, tax = this.state.journalmast.tax) => {
    let debit = 0;
    let credit = 0;
    for (let i = 0; i < rows.length; i++) {
      debit += Number(rows[i].debit);
      credit += Number(rows[i].credit);
    }
    this.setState({ rows, debit, credit });
  };
  changeEditRow = (editRow) => {
    let { rows } = this.state;
    if (editRow < rows.length) {
      return;
    }

    this.setState({ editRow });
  };
  print = () => {
    let {
      productObjects,
      rows,
      total,
      vat,
      grand,
      customerObjects,
      journalmast,
    } = this.state;
    let data = [];
    rows.forEach((element, index) => {
      if (index < rows.length - 1) {
        data.push({
          ...element,
          item:
            productObjects[element.item_id] &&
            productObjects[element.item_id].p_name,
        });
      }
    });
    let printData = {
      title: "Journal Voucher",
      inv_no: journalmast.inv_no,
      date: moment(journalmast.date).format("YYYY-MM-DD"),
      user: customerObjects[journalmast.cust_id].cust_name,
      address: customerObjects[journalmast.cust_id].address,
      data,
      total,
      vat,
      grand,
    };
    PrintService.printInvoice(printData);
  };

  handleProjectChange = (name, selected) => {
    //debugger;
    let { rows, editRow } = this.state;
    rows[editRow][name] = selected.value;
    if (name === "ledger_Code") {
      rows[editRow].ledgerName = this.state.chartOfaccObject[
        selected.value
      ].ledger_name;
      rows[editRow].mast_Code = this.state.chartOfaccObject[
        selected.value
      ].mast_Code;
    } else if (name === "project_id") {
      this.setState({ selectedProject: selected });
    }
    this.caculationTable(rows);
    this.setState({ rows, changed: true });
  };
  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      journalmast,
      chartOfacc,
      chartOfaccObject,
      editRow,
      debit,
      credit,
      projects,
      selectedProject,
    } = this.state;
    let data = this.state.rows;
    //debugger;
    return (
      <React.Fragment>
        <Paper className="mb-16 p-16" style={{ padding: "1em" }}>
          <Grid container>
            <Grid item xs={12} sm={4} md={3}>
              <LabelControl label="Voucher No">
                <TextField
                  className="no-padding-input"
                  fullWidth
                  disabled
                  variant="outlined"
                  value={journalmast.VoucherNo}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <LabelControl label="Date">
                <TextField
                  className="no-padding-input"
                  fullWidth
                  disabled
                  variant="outlined"
                  value={moment(journalmast.date).format("YYYY-MM-DD")}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}></Grid>
            <Grid item xs={12} sm={4} md={3}>
              <LabelControl label="Project">
                <AutoSelect
                  className="basic-single"
                  value={selectedProject}
                  onChange={this.handleProjectChange}
                  isSearchable={true}
                  name="project_id"
                  options={Arrays(projects, "project_name", "branch_code")}
                />
              </LabelControl>
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
              {data.map((row, index) =>
                index !== editRow ? (
                  <TableRow
                    key={index}
                    className="unedit-row"
                    onClick={() => this.changeEditRow(index)}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">
                      {chartOfaccObject.hasOwnProperty(row.ledger_Code)
                        ? chartOfaccObject[row.ledger_Code].ledger_name
                        : 0}
                    </TableCell>
                    <TableCell align="left">{row.debit || "-"}</TableCell>
                    <TableCell align="left">{row.credit || "-"}</TableCell>
                    <TableCell align="left">{row.naration || ""}</TableCell>
                    {/* <TableCell align="left">{row.remarks || ""}</TableCell> */}
                    <TableCell align="left">
                      <IconButton
                        onClick={() => this.removeDetail(index)}
                        className="color-brown"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={index} className="edit-row">
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">
                      {/* <AutoComplete
                        className='no-padding-select'
                        fullWidth variant='outlined'
                        options={chartOfacc}
                        getOptionLabel={option => option.ledger_name}
                        value={data[editRow].ledger_Code || ''}
                        renderInput={params => (
                          <TextField {...params} label="Combo box" variant="outlined" fullWidth />
                        )}
                        InputLabelProps={{ shrink: false }}
                      >
                      </AutoComplete> */}
                      <AutoSelect
                        className="basic-single"
                        value={getAutoSelectValue(
                          Arrays(chartOfacc, "ledger_name", "ledger_Code"),
                          data[editRow].ledger_Code
                        )}
                        onChange={this.handleProjectChange}
                        isSearchable={true}
                        name="ledger_Code"
                        options={Arrays(
                          chartOfacc,
                          "ledger_name",
                          "ledger_Code"
                        )}
                      />
                      {/* <TextField
                        className="no-padding-select"
                        fullWidth
                        select
                        variant="outlined"
                        value={data[editRow].ledger_Code || ""}
                        onChange={this.handleDetailChange("ledger_Code")}
                        error={
                          !Validations.IntegerValidation(
                            data[editRow].ledger_Code
                          )
                        }
                        InputLabelProps={{ shrink: false }}
                      >
                        {chartOfacc.map((element, index) => (
                          <MenuItem key={index} value={element.ledger_Code}>
                            {element.ledger_name}
                          </MenuItem>
                        ))}
                      </TextField> */}
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        className="no-padding-input"
                        fullWidth
                        variant="outlined"
                        margin="none"
                        value={data[editRow].debit}
                        onChange={this.handleDetailChange("debit")}
                        error={
                          !Validations.DoubleValidation(data[editRow].debit)
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        className="no-padding-input"
                        fullWidth
                        variant="outlined"
                        margin="none"
                        value={data[editRow].credit}
                        onChange={this.handleDetailChange("credit")}
                        error={
                          !Validations.DoubleValidation(data[editRow].credit)
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        className="no-padding-input"
                        fullWidth
                        variant="outlined"
                        value={data[editRow].naration || ""}
                        onChange={this.handleDetailChange("naration")}
                      />
                    </TableCell>
                    {/* <TableCell align="left">
                      <TextField
                        className="no-padding-input"
                        fullWidth
                        variant="outlined"
                        value={data[editRow].remarks || ""}
                        onChange={this.handleDetailChange("remarks")}
                      />
                    </TableCell> */}
                    <TableCell align="left">
                      {data[editRow].ledger_Code === "" && (
                        <IconButton
                          onClick={() => this.removeDetail(index)}
                          className="color-brown"
                        >
                          <Delete />
                        </IconButton>
                      )}
                      {data[editRow].ledger_Code !== "" && (
                        <IconButton
                          onClick={() => this.addNewRow(index)}
                          className="color-brown"
                        >
                          <Add />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
              <TableRow>
                <TableCell colSpan={2} align="right">
                  Total
                </TableCell>
                <TableCell align="left">{utils.toFixNumber(debit)}</TableCell>
                <TableCell align="left">{utils.toFixNumber(credit)}</TableCell>
                <TableCell align="left" colSpan={4}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="action-part flex justify-between items-center">
            {console.log(debit, credit)}
            <LabelControl
              label="Remarks"
              classes={["flex-row", "voucher-remarks"]}
            >
              <TextField
                className="no-padding-input"
                fullWidth
                variant="outlined"
                value={(data[editRow] && data[editRow].remarks) || ""}
                onChange={this.handleDetailChange("remarks")}
                width={200}
              />
            </LabelControl>
            <div>
              <Button
                onClick={this.handleSave}
                variant="contained"
                color="primary"
                disabled={!this.state.changed}
              >
                {journalmast.id ? "Update" : "Save"}
              </Button>
              {journalmast.id && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleRemove(journalmast)}
                >
                  Delete
                </Button>
              )}
              {journalmast.id && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.print}
                >
                  Print
                </Button>
              )}
              {this.props.editClose && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.props.editClose}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Paper>
      </React.Fragment>
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
  connect(mapStateToProps, mapDispatchToProps)(EditVoucher)
);
