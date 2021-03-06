import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Button,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Snackbar,
} from "@material-ui/core";
import { FusePageSimple, FuseAnimate } from "@fuse";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import { stableSort, getSorting } from "../../../helper/TableSortHepler";
import SaleService from "../../../services/SaleService";
import CustomerService from "../../../services/CustomerService";
import FilterDialog from "./Filter.Dialog";
import InvoiceDialog from "./Invoice.Dialog";
import { SupervisorAccount } from "@material-ui/icons";
import moment from "moment";
const tableColumes = [
  { id: "inv_no", numeric: false, disablePadding: true, label: "Invoice No" },
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "cust_id", numeric: false, disablePadding: true, label: "Customer" },
  {
    id: "netamount",
    numeric: false,
    disablePadding: true,
    label: "Bill Amount",
  },
  { id: "taxable", numeric: false, disablePadding: true, label: "Taxable" },
  { id: "tax", numeric: false, disablePadding: true, label: "Tax" }, 
  { id: "discout", numeric: false, disablePadding: true, label: "Discount" },
  { id: "net_dues", numeric: false, disablePadding: true, label: "Net Dues" },
  { id: "status", numeric: false, disablePadding: true, label: "Status" },
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

class AllInvoicesPage extends Component {
  state = {
    order: "asc",
    orderBy: "",
    rows: [],
    customers: [],
    customerObjects: {},
    types: {},
    open: false,
    edit: false,
    editRow: 0,
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    status: {
      0: { value: 0, label: "Open" },
      1: { value: 1, label: "Paid" },
      2: { value: 2, label: "OverDue" },
    },
    filter: {
      cust_id: -1,
      min: 0,
      max: 0,
      datewise: {},
      types: [],
    },
    bilAmount: 0,
    taxable: 0,
    tax: 0,
    discount: 0
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  async componentDidMount() {
    let rows = await SaleService.getSales();
    const customers = await CustomerService.getCustomerServices();
    let customerObjects = {};
    customers.forEach((element) => {
      customerObjects[element.cust_id] = element;
    });
    this.setState({ rows, customerObjects, customers });
    this.countTotal(rows);
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
    return rows.filter((element) => {
      return (
        (!filter.types.length || filter.types.includes(element.status)) &&
        (filter.cust_id === -1 || element.cust_id === filter.cust_id) &&
        (!moment.isMoment(filter.datewise.from) ||
          moment(element.date) >= filter.datewise.from) &&
        (!moment.isMoment(filter.datewise.to) ||
          moment(element.date) <= filter.datewise.to) &&
        (!filter.min || element.netamount >= filter.min) &&
        (!filter.max || element.netamount <= filter.max)
      );
    });
  };

  countTotal = async (data) => {
    let { bilAmount ,taxable, tax ,discount} = this.state;
    data.forEach((element) => {
      bilAmount += element.netamount;
      taxable += element.taxable;
      tax += element.tax;
      discount +=element.discount;
    });
    this.setState({
      bilAmount,tax,taxable,discount
    });
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
  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      page,
      rowsPerPage,
      taxable,
      tax,
      discount,
      customers,
      bilAmount,
    } = this.state;
    const { vertical, horizontal, open } = this.state;
    let filterData = this.filtering();
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24",
        }}
        header={
          <div className="p-24 pt-sm pb-sm flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <SupervisorAccount className="text-32 mr-12 fs-md" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex fs-md">
                    {"All Invoice"}
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
                onClick={this.showFilter}
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
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.id}
                      className="change-row"
                      onClick={() => this.edit(row.id)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "50px" }}
                      >
                        {row.inv_no}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.date).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell align="left">
                        {row.customerName}
                      </TableCell>
                      <TableCell align="left">{row.netamount}</TableCell>
                      <TableCell align="left">{row.taxable}</TableCell>
                      <TableCell align="left">
                        {row.tax}
                      </TableCell>
                      <TableCell>{row.discount}</TableCell>
                      <TableCell>{moment(row.net_dues).format("YYYY-MM-DD")}</TableCell>
                      <TableCell>{row.status?"paid":"open"}</TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        {"No Invoice found."}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="change-row">
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "50px" }}
                    ></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="left">{bilAmount}</TableCell>
                    <TableCell align="left">{taxable}</TableCell>
                    <TableCell align="left">{tax}</TableCell>
                    <TableCell align="left">{discount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filterData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              key={`${vertical},${horizontal}`}
              open={open}
              onClose={this.handleClose}
              ContentProps={{
                "aria-describedby": "message-id",
              }}
              disableWindowBlurListener={true}
              message={<span id="message-id">Successfully Update!</span>}
            />
            {this.state.filter && (
              <FilterDialog
                onClose={this.onFilterDialogClose}
                changeFilter={this.changeFilter}
                filter={this.state.filter}
                customers={customers}
                open={this.state.showFilter}
              />
            )}
            <InvoiceDialog
              open={this.state.edit}
              editId={this.state.editRow}
              editClose={this.editClose}
              onRemove={this.removeSale}
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
  connect(mapStateToProps, mapDispatchToProps)(AllInvoicesPage)
);
