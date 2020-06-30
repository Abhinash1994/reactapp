import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  withStyles,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Grid,
  TextField,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import moment from "moment";
import * as authActions from "app/auth/store/actions";
import EnhancedTableHead from "../../../components/EnhancedTableHead";
import swal from 'sweetalert';
// import { stableSort, getSorting } from '../../../helper/TableSortHepler'
import SupplierService from "../../../services/SupplierService";
import PurchaseService from "../../../services/PurchaseService";
import PurchaseDetailService from "../../../services/PurchaseDetailService";
import ProductService from "../../../services/ProductService";
import { taxType } from "../../../../config";
import utils from "../../../helper/utils";
import { NotificationManager } from "react-notifications";
import { Delete, Add } from "@material-ui/icons";
import AsyncSelect from "react-select/async";
import PrintService from "../../../services/PrintService";
import LabelControl from "../../../components/LabelControl";
import isEmpty from "app/helper/utils/isEmpty";
import AutoSelect from "app/components/Common/AutoSelect";

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
const tableColumes = [
  { id: "sn", numeric: false, disablePadding: true, label: "S.N." },
  { id: "sku", numeric: false, disablePadding: true, label: "SKU" },
  { id: "item_id", numeric: false, disablePadding: true, label: "Item Name" },
  { id: "qty", numeric: false, disablePadding: true, label: "Qty" },
  { id: "unit_id", numeric: false, disablePadding: true, label: "Unit" },
  { id: "price", numeric: false, disablePadding: true, label: "Price" },
  { id: "discount", numeric: false, disablePadding: true, label: "Discount" },
  { id: "total", numeric: false, disablePadding: true, label: "Total" },
  { id: "tax", numeric: false, disablePadding: true, label: "Vat" },
  { id: "netdues", numeric: false, disablePadding: true, label: "Grand" },
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

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    borderBottom: "1px solid #e4e4e4",
    color: state.selectProps.menuColor,
  }),

  control: (_, { selectProps: { width } }) => ({
    width: width,
    display: "flex",
    border: "2px solid lightgrey",
    borderrRadius: "4px",
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};
class EditPurchase extends Component {
  state = {
    order: "asc",
    orderBy: "cust_id",
    editRow: 0,
    rows: [],
    suppliers: [],
    products: [],
    supplierObjects: {},
    productObjects: {},
    purchasemast: {
      date: moment(),
      cust_id: 0,
      agent_id: 0,
      inv_no: "",
      tax: 1,
      taxable: 0,
      discount: 0,
      netamount: 0,
      status: 0,
    },
    total: 0,
    totalDiscount: 0,
    grand: 0,
    selectedSupplierBalance:0,
    selectedQOH: 0,
    selectSupplier: {},
    vat: 0,
    changed: false,
  };

  validate() {
    if (this.state.order_ref && this.state.purchasemast.cust_id) {
      return true
    }
    return false
  }
  handleClose = () => {
    this.setState({ open: false });
  };
  handleOrderRef(e) {
    this.setState({ order_ref: e.target.value })
  }
  createNewRow = () => {
    let row = {
      inv_no: "",
      item_id: "",
      unit_id: 0,
      price: "",
      qty: 1,
      total: 0,
      tax: 0,
      net_amount: 0,
      status: 1,
      vat: 0,
      discount: 0,
      sku: "",
    };
    let { rows } = this.state;
    rows.push(row);
    this.setState({ rows });
  };

  async componentDidMount() {
    const suppliers = await SupplierService.getSuppliers();
    const products = await ProductService.getProductServices();
    //debugger;
    let supplierObjects = {};
    let productObjects = {};
    let productOptions = [];
    suppliers.forEach((element) => {
      supplierObjects[element.cust_id] = element;
    });
    products.forEach((element) => {
      productObjects[element.id] = element;
      productOptions.push({
        value: element.id,
        label: element.p_name,
      });
    });
    this.setState({
      suppliers,
      products,
      productObjects,
      productOptions,
      supplierObjects,
    });
    if (this.props.editId) {
      let purchasemast = await PurchaseService.getPurchase(this.props.editId);
      let rows = await PurchaseDetailService.getPurchaseDetailsByInv(
        purchasemast.inv_no
      );
      this.setState({ purchasemast });
      this.caculationTable(rows);
      this.createNewRow();
    } else {
      this.state.purchasemast.inv_no = await PurchaseService.getPurchaseNumber();
      this.createNewRow();
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleSave = async () => {
    // swal({
    //   title: "Are you sure?",
    //   text: "You want to create invoice",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // })
    //   .then(async (success) => {
    //     if (success) {
    //       if (!this.checkBeforeSave()) {
    //         NotificationManager.error("Please check your invoice", "Input Error");
    //         return;
    //       }
          
    //       this.print();
    //     }
    //   });
    let purchasemast = this.state.purchasemast;
          let purchasedetail = this.state.rows;
          purchasemast.tax = this.state.vat;
          purchasemast.taxable = this.state.total;
          purchasemast.netamount = this.state.grand;
          purchasemast.order_ref = this.state.order_ref
          let type = purchasemast.id ? "edit" : "add";
          if (type === "edit") {
            await PurchaseService.updatePurchase(purchasemast);
            this.state.rows.forEach(async (r, index) => {
              r.tax = r.vat;
              if (index < this.state.rows.length - 1) {
                if (r.id) {
                  await PurchaseDetailService.updatePurchaseDetail(r,purchasedetail);
                } else {
                  r.inv_no = purchasemast.inv_no;
                  await PurchaseDetailService.createPurchaseDetail(r,purchasedetail);
                }
              }
            });
            NotificationManager.success(
              "Successfully update purchase",
              "Update Purchase"
            );
          } else {
            let newPurchase = await PurchaseService.createPurchase(purchasemast,purchasedetail);
            if (newPurchase) {
              this.state.rows.forEach(async (row, index) => {
                row.inv_no = newPurchase.inv_no;
                row.tax = row.vat;
                if (index < this.state.rows.length - 1) {
                  await PurchaseDetailService.createPurchaseDetail(row,purchasedetail);
                }
              });
              this.setState({ purchasemast: newPurchase });
              NotificationManager.success(
                "Successfully create purchase",
                "Create Purchase"
              );
            }
          }
          this.setState({ changed: false });
  };

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

  handleRemove = async (row) => {
    let result = await PurchaseService.remvoePurchase(row.id);
    if (result) {
      this.setState({
        purchasemast: {
          date: moment(),
          cust_id: 0,
          inv_no: 0,
          tax: 1,
          discount: 0,
          netamount: 0,
          status: 0,
          agent_id: 0,
        },
      });
      if (this.props.onRemove) {
        this.props.onRemove(row.id);
      }
    }
  };

  handleDetele() {
    this.setState({ isDeleted: !this.state.isDeleted })
  }
  removeDetail = async (index) => {
    let { rows } = this.state;
    rows = rows.filter((element, rowIndex) => rowIndex !== index);
    this.setState({ rows, editRow: this.state.rows.length - 2 });

    if (rows.length === 0) {
      this.createNewRow();
      return;
    }
    this.countTotal();
  };

  handlepurchasemastChange = (name) => (event) => {
    switch (name) {
      default:
        this.setState({
          purchasemast: {
            ...this.state.purchasemast,
            [name]: event.target.value,
          },
        });
    }
    if (name === "tax")
      this.caculationTable(this.state.rows, event.target.value);
    this.setState({ changed: true });
  };
  handleDetailChange = (name) => (event) => {
    this.setChangedField(name, event.target.value);
  };

  setChangedField = (name, value) => {
    let { rows, editRow, productObjects } = this.state;
    rows[editRow][name] = value;
    let selectedQOH = 0;
    if (name === "item_id") {
      rows[editRow].price = productObjects[rows[editRow].item_id].s_price;
      rows[editRow].vat = productObjects[rows[editRow].item_id].taxtype;
      selectedQOH = productObjects[rows[editRow].item_id].qtyonhand;
    }
    this.caculationTable(rows);
    this.setState({ changed: true, selectedQOH, productError: !this.state.productError });
  };
  caculationTable = (rows, tax = this.state.purchasemast.tax) => {
    let total = 0;
    let grand = 0;
    let vat = 0;
    let totalDiscount = 0;
    for (let i = 0; i < rows.length; i++) {
      rows[i].total = rows[i].qty * rows[i].price;
      rows[i].vat = rows[i].item_id
        ? (rows[i].total *
          (tax / Math.abs(tax)) *
          this.state.productObjects[rows[i].item_id].taxtype) /
        100
        : 0;
      rows[i].grand = rows[i].total + rows[i].vat - rows[i].discount;
      // rows[i].discount = rows[i].item_id
      //   ? (rows[i].total * this.state.purchasemast.discount) / 100
      //   : 0;
      total += rows[i].total ? rows[i].total : 0;
      grand += rows[i].grand ? rows[i].grand : 0;
      vat += rows[i].vat ? rows[i].vat : 0;
      totalDiscount += parseInt(rows[i].discount) ? parseInt(rows[i].discount) : 0;
    }
    this.setState({ rows, grand, total, vat, totalDiscount });
  };
  changeEditRow = (editRow) => {
    let { rows } = this.state;
    if (editRow < rows.length) {
      return;
    }
    this.setState({ editRow });
  };

  countTotal = () => {
    let { rows, grand, total, vat } = this.state;
    total = 0;
    grand = 0;
    vat = 0;
    rows.forEach((element) => {
      grand += element.grand;
      total += element.total;
      vat += element.vat;
    });
    this.setState({ grand, total, vat });
  };

  async addNewRow(index) {
    let { rows } = this.state;
    if (!rows[index].item_id) {
      NotificationManager.error("Please Select Item first.");
      return;
    }
    await this.createNewRow();
    this.setState({ editRow: this.state.editRow + 1, productError: !this.state.productError });
  }

  print = () => {
    swal({
      title: "Are you sure?",
      text: "You want to print invoice",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (success) => {
        if (success) {
          let {
            productObjects,
            rows,
            total,
            vat,
            grand,
            supplierObjects,
            purchasemast,
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
        let selectSupplier = supplierObjects[purchasemast.cust_id];
          let printData = {
            title: "PURCHASE",
            inv_no: purchasemast.inv_no,
            date: moment(purchasemast.date).format("YYYY-MM-DD"),
            user: !isEmpty(selectSupplier) ? selectSupplier.cust_name : "",
            address: !isEmpty(selectSupplier) ? selectSupplier.address : "",
            data,
            total,
            vat,
            grand,
          };
          PrintService.printInvoice(printData);
        }
      });
  };

  loadOptions = (inputValue, callback) => {
    callback(this.filterSKU(inputValue));
  };

  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, "");
    //this.handleSKUChange("sku", newValue);
    this.setState({ inputValue });
    return inputValue;
  };

  filterSKU = (inputValue) => {
    return this.state.productOptions.filter(
      (i) => i.value === inputValue || i.barCode === inputValue
    );
  };

  handleSKUChange = (name, value) => {
    let { rows, editRow, productObjects } = this.state;
    rows[editRow][name] = value;
    this.caculationTable(rows);
    //debugger;
    let selectedQOH = productObjects[value].qty;

    this.setState({ changed: true, selectedQOH });
  };

  handleSelectChange = (name, selected) => {
    if (name === "cust_id") {
      const { customers } = this.state;
      let selectedSupplierBalance = customers.find(
        (x) => x.id === selected.value
      ).balance;
      this.setState({
        purchasemast: {
          ...this.state.purchasemast,
          [name]: selected.value,
        },
        selectedCustomer: selected,
        selectedSupplierBalance,
      });
      this.setState({ changed: true });
    } else {
      this.handleSKUChange(name, selected.value);
    }
  };
  handleSelectProduct = (name, selected) => {
    if (name === "cust_id") {
      const { suppliers } = this.state;
      let selectedSupplierBalance = suppliers.find(
        (x) => x.id === selected.value
      ).balance;
      this.setState({
        purchasemast: {
          ...this.state.purchasemast,
          [name]: selected.value,
        },
        selectSupplier: selected,
        selectedSupplierBalance,
      });
      this.setState({ changed: true});
    } else {
      this.handleSKUChange(name, selected.value);
  }
}
  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      suppliers,
      purchasemast,
      productObjects,
      products,
      editRow,
      total,
      totalDiscount,
      selectedQOH,
      selectedSupplierBalance,
      grand,
      selectSupplier,
      vat,
    } = this.state;
    let data = this.state.rows;
    let isValid = this.validate();
    return (
      <React.Fragment>
        <Paper className="mb-16 p-16" style={{ padding: "1em" }}>
          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label="Purchase No">
                <TextField
                  className="no-padding-input"
                  fullWidth
                  disabled
                  variant="outlined"
                  value={purchasemast.inv_no}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label="Date">
                <TextField
                  className="no-padding-input"
                  fullWidth
                  disabled
                  variant="outlined"
                  value={moment(purchasemast.date).format("YYYY-MM-DD")}
                />
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label="Tax Type">
                <TextField
                  className="no-padding-select"
                  fullWidth
                  select
                  variant="outlined"
                  value={purchasemast.tax / Math.abs(purchasemast.tax) || ""}
                  onChange={this.handlepurchasemastChange("tax")}
                >
                  {taxType.map((element, index) => (
                    <MenuItem key={index} value={element.value}>
                      {element.label}
                    </MenuItem>
                  ))}
                </TextField>
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label="Supplier Name">
              <AutoSelect
                  className="no-padding-select"
                  fullWidth
                  value={selectSupplier}
                  onChange={this.handleSelectProduct}
                  isSearchable={true}
                  name="cust_id"
                  options={Arrays(suppliers, "cust_name", "id")}
                />
                <span className="isvalid" style={isValid ? { display: 'none' } : { color: '#b7b7b7' }}>Cannot be empty<span style={{ color: 'red' }}>*</span></span>
              </LabelControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelControl label="Order Reference">
                <TextField
                  className="no-padding-input"
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Reference No"
                  value={this.state.order_ref}
                  onChange={(e) => this.handleOrderRef(e)}
                />
                <span className="isvalid" style={isValid ? { display: 'none' } : { color: '#b7b7b7' }}>Cannot be empty<span style={{ color: 'red' }}>*</span></span>
              </LabelControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              className="flex items-center justify-between"
            >
              <LabelControl label="Balance">
                <span className="fs-md">{selectedSupplierBalance}</span>
              </LabelControl>
              <LabelControl label="QOH">
                <span className="fs-md">{selectedQOH}</span>
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
                      {productObjects[row.item_id] &&
                        productObjects[row.item_id].p_name}
                    </TableCell>
                    <TableCell align="left">
                      {productObjects[row.item_id] &&
                        productObjects[row.item_id].p_name}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.qty || 1}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.Unit || 1}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.price || 0}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.discount || 0}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.total || 0}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.vat || 0}
                    </TableCell>
                    <TableCell align="left" style={{ width: "50px" }}>
                      {row.grand || 0}
                    </TableCell>
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
                    <TableRow key={index} className={this.state.isDeleted ? "edit-row-block" : "edit-row"} style={isValid?{display:'contents'}:{display:'none'}}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        <AsyncSelect
                          cacheOptions
                          loadOptions={this.loadOptions}
                          defaultOptions
                          onInputChange={this.handleInputChange}
                          defaultValue={data[editRow].sku}
                          width="200px"
                          styles={customStyles}
                          onChange={(value, action) => {
                            this.handleSelectChange(action.name, value);
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <TextField
                          className="no-padding-select"
                          fullWidth
                          select
                          variant="outlined"
                          value={data[editRow].item_id}
                          onChange={this.handleDetailChange("item_id")}
                          InputLabelProps={{ shrink: false }}
                          SelectProps={{ padding: "5px" }}
                          style={!this.state.productError ? { paddingTop: '2rem' } : { paddingTop: '0px' }}
                        >
                          {products.map((element, index) => (
                            <MenuItem key={index} value={element.id}>
                              {element.p_name}
                            </MenuItem>
                          ))}
                        </TextField>
                        <span className="isvalid" style={this.state.productError ? { display: 'none' } : { color: '#b7b7b7', fontSize: '10px' }}>Cannot be empty<span style={{ color: 'red' }}>*</span></span>
                      </TableCell>
                      <TableCell align="left">
                        <TextField
                          className="no-padding-input text-center"
                          fullWidth
                          variant="outlined"
                          margin="none"
                          value={data[editRow].qty}
                          onChange={this.handleDetailChange("qty")}
                          style={{ width: "50px" }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.Unit}</TableCell>
                      <TableCell align="left">
                        <TextField
                          className="no-padding-input"
                          fullWidth
                          variant="outlined"
                          value={data[editRow].price}
                          onChange={this.handleDetailChange("price")}
                          style={{ width: "50px" }}
                        />
                      </TableCell>
                      <TableCell align="left" style={{ width: "50px" }}>
                        <TextField
                          className="no-padding-input text-center"
                          fullWidth
                          variant="outlined"
                          margin="none"
                          value={data[editRow].discount}
                          onChange={this.handleDetailChange("discount")}
                          style={{ width: "80px" }}
                        />
                      </TableCell>
                      <TableCell align="left" style={{ width: "50px" }}>
                        {row.total}
                      </TableCell>
                      <TableCell align="left" style={{ width: "50px" }}>
                        {row.vat}
                      </TableCell>
                      <TableCell align="left" style={{ width: "50px" }}>
                        {row.grand}
                      </TableCell>
                      <TableCell align="left" style={{ width: "50px" }}>
                        {data[editRow].item_id === "" && (
                          <IconButton
                            onClick={() => this.handleDetele(index)}
                            className="color-brown"
                          >
                            <Delete />
                          </IconButton>
                        )}
                        {data[editRow].item_id !== "" && (
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
                <TableCell colSpan={6} align="right">
                  Total
                </TableCell>
                <TableCell align="left">
                  {utils.toFixNumber(parseInt(totalDiscount))}
                </TableCell>
                <TableCell align="left">{utils.toFixNumber(total)}</TableCell>
                <TableCell align="left">{utils.toFixNumber(vat)}</TableCell>
                <TableCell align="left">{utils.toFixNumber(grand)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="action-part flex justify-end">
            <Button
              onClick={this.handleSave}
              variant="contained"
              color="primary"
              disabled={!this.state.productError}
            >

              {purchasemast.id ? "Update" : "Save"}
            </Button>
            {purchasemast.id && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleRemove(purchasemast)}
              >
                Delete
              </Button>
            )}
            {purchasemast.id && (
              <Button variant="contained" color="primary" /* onClick={this.print} */>
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
  connect(mapStateToProps, mapDispatchToProps)(EditPurchase)
);
