import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Button,
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
import CustomerService from "../../../services/CustomerService";
import FilterDialog from "./Filter.Dialog";
import { SupervisorAccount } from "@material-ui/icons";
import moment from "moment";
import ProductService from "../../../services/ProductService";
import SaleDetailService from "../../../services/SaleDetailService";
const tableColumes = [
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "item_id", numeric: false, disablePadding: true, label: "Item Name" },
  { id: "inv_no", numeric: false, disablePadding: true, label: "Invoice No" },
  { id: "qty", numeric: false, disablePadding: true, label: "Qty" },
  { id: "price", numeric: false, disablePadding: true, label: "Price" },
  { id: "total", numeric: false, disablePadding: true, label: "Total" },
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
  state = {
    order: "asc",
    orderBy: "",
    rows: [],
    customers: [],
    customerObjects: {},
    products: [],
    productObjects: {},
    types: {},
    open: false,
    edit: false,
    editRow: 0,
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    total: 0,
    status: {
      0: { value: 0, label: "Open" },
      1: { value: 1, label: "Paid" },
      2: { value: 2, label: "OverDue" },
    },
    filter: {
      item_id: -1,
      min: 0,
      max: 0,
      datewise: {},
      types: [],
    },
    mounted: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  async componentDidMount() {
    this.mounted = true;
    let rows = await SaleDetailService.getSaleDetails();
    const customers = await CustomerService.getCustomerServices();
    const products = await ProductService.getProductServices();
    let customerObjects = {};
    let productObjects = {};
    customers.forEach((element) => {
      customerObjects[element.cust_id] = element;
    });
    products.forEach((element) => {
      productObjects[element.id] = element;
    });
    if (this.mounted)
      this.setState({
        rows,
        customerObjects,
        customers,
        products,
        productObjects,
      });
  }

  componentWillUnmount() {
    this.mounted = false;
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
        (filter.item_id === -1 || element.item_id === filter.item_id) &&
        (!moment.isMoment(filter.datewise.from) ||
          moment(element.date) >= filter.datewise.from) &&
        (!moment.isMoment(filter.datewise.to) ||
          moment(element.date) <= filter.datewise.to) &&
        (!filter.min || element.total >= filter.min) &&
        (!filter.max || element.total <= filter.max);
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
  render() {
    const { classes } = this.props;
    const { order, orderBy, customers, productObjects } = this.state;
    const { vertical, horizontal, open } = this.state;
    let filterData = this.filtering();
    let data = stableSort(filterData.result, getSorting(order, orderBy));
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
                    {"Sales Report"}
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
                      <TableCell align="left">
                        {moment(row.date).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell align="left">
                        {productObjects.hasOwnProperty(row.item_id)
                          ? productObjects[row.item_id].p_name
                          : "Removed Item"}
                      </TableCell>
                      <TableCell align="left">{row.inv_no}</TableCell>
                      <TableCell align="left">{row.qty}</TableCell>
                      <TableCell align="left">{row.price}</TableCell>
                      <TableCell align="left">{row.total}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="right" colSpan={5}>
                      Total
                    </TableCell>
                    <TableCell align="left">{filterData.total}</TableCell>
                  </TableRow>
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={8}>
                        {"No Invoice found."}
                      </TableCell>
                    </TableRow>
                  )}
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
