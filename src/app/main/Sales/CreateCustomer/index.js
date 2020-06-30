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
import CustomerDialog from "./Customer.Dialog";
import { stableSort, getSorting } from "../../../helper/TableSortHepler";
import CustomerService from "../../../services/CustomerService";
import FilterDialog from "./Filter.Dialog";
import { SupervisorAccount } from "@material-ui/icons";
const tableColumes = [
  {
    id: "cust_name",
    numeric: false,
    disablePadding: true,
    label: "Customer Name",
  },
  { id: "address", numeric: false, disablePadding: true, label: "Address" },
  { id: "tel", numeric: false, disablePadding: true, label: "Telephone" },
  { id: "mob", numeric: false, disablePadding: true, label: "Mobile" },
  { id: "netdues", numeric: false, disablePadding: true, label: "Net Dues" },
  { id: "action", numeric: false, disablePadding: true, label: "" },
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

class CustomerPage extends Component {
  state = {
    order: "asc",
    orderBy: "cust_id",
    rows: [],
    types: {},
    open: false,
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    filter: {
      types: [],
    },
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  async componentDidMount() {
    let rows = await CustomerService.getCustomerServices();
    this.setState({ rows });
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

  handleSave = async (row, type) => {
    if (type === "edit") {
      let data = await CustomerService.updateCustomerService(row);
      if (data) {
        let rows = await CustomerService.getCustomerServices();
        this.setState({ rows });
      }
    } else {
      let newCustomer = await CustomerService.createCustomerService(row);
      if (newCustomer) {
        let { rows } = this.state;
        rows.push(newCustomer);
        this.setState({ rows });
      }
    }
  };

  handleRemove = async (row) => {
    let result = await CustomerService.remvoeCustomerService(row.cust_id);
    if (result) {
      let rows = this.state.rows.filter(
        (element) => element.cust_id !== row.cust_id
      );
      this.setState({ rows });
    }
  };
  showFilter = () => {
    this.setState({ showFilter: true });
  };
  filtering = () => {
    let { rows, filter } = this.state;
    return rows.filter((element) => {
      return !filter.types.length || filter.types.includes(element.p_type);
    });
  };
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  };
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;
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
          <div className="px-24 pt-sm pb-sm flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <SupervisorAccount className="text-32 mr-12 fs-md" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex fs-md">
                    {"Create Customer"}
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
          <div className="p-16 sm:p-24 product-service-page">
            <CustomerDialog
              type="add"
              onSave={this.handleSave}
              onChangeLogo={this.handleLogoChange}
              onRemove={this.handleRemove}
              row={{
                cust_name: "",
                address: "",
                email: "",
                region: "",
                mob: "",
                tel: "",
                type: "",
                netdues: "",
                s_agent: "",
                status: "",
              }}
            />
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
                    <TableRow key={row.cust_id}>
                      <TableCell component="th" scope="row">
                        {row.cust_name}
                      </TableCell>
                      <TableCell align="left">{row.address}</TableCell>
                      <TableCell align="left">{row.tel}</TableCell>
                      <TableCell align="left">{row.mob}</TableCell>
                      <TableCell align="left">{`Net ${row.netdues}`}</TableCell>
                      <TableCell align="left">
                        <CustomerDialog
                          type="edit"
                          onSave={this.handleSave}
                          onRemove={this.handleRemove}
                          row={row}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell align="left" colSpan={6}>
                        {"No Customer found."}
                      </TableCell>
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
            <FilterDialog
              onClose={this.onFilterDialogClose}
              changeFilter={this.changeFilter}
              filter={this.state.filter}
              open={this.state.showFilter}
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
  connect(mapStateToProps, mapDispatchToProps)(CustomerPage)
);
