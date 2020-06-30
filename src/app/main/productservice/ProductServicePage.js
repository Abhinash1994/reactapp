import React, { Component } from 'react';
import {
  withStyles, Typography, Icon, Button,TablePagination,
  Table, TableBody, TableCell, TableRow, Paper, Snackbar
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import ProductServiceDialog from './ProductServiceDialog';
import ProductService from '../../services/ProductService';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import './style.scss'
import ProductGroupService from '../../services/ProductGroupService';
import { productTypes } from '../../../config';
import FilterDialog from './Filter.Dialog';
const tableColumes = [
  { id: 'p_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'sku', numeric: false, disablePadding: false, label: 'SKU' },
  { id: 'p_type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'p_group', numeric: false, disablePadding: false, label: 'Group' },
  { id: 'd_name', numeric: false, disablePadding: false, label: 'Display Name' },
  { id: 'qtyonhand', numeric: false, disablePadding: false, label: 'Quantity On Hand' },
  { id: 'barcode', numeric: false, disablePadding: false, label: 'BarCode' },
];

const styles = theme => ({
  layoutHeader: {
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down('md')]: {
      height: 240,
      minHeight: 240
    }
  }
});

class ProductServicePage extends Component {

  state = {
    order: 'asc',
    orderBy: 'name',
    rows: [],
    productGroups: {},
    types: {},
    open: false,
    vertical: 'center',
    horizontal: 'center',
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    filter: {
      types: []
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await ProductService.getProductServices()
    let groups = await ProductGroupService.getProductGroups();
    let productGroups = {};
    let types = {};
    groups.forEach(element => {
      productGroups[element.id] = element;
    });
    productTypes.forEach(element => {
      types[element.id] = element;
    });
    this.setState({ rows, productGroups, types });
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  handleLogoChange = (e) => {
    this.setState({
      Logo: e.target.files[0]
    })
  }

  handleSave = async (row, type) => {
    if (type === 'edit') {
      await ProductService.updateProductService(row);
      let rows = await ProductService.getProductServices();
      this.setState({ rows });
    } else {
      let newProductService = await ProductService.createProductService(row);
      if (newProductService) {
        let rows = await ProductService.getProductServices();
        this.setState({ rows });
      }
    }
  }

  handleRemove = async row => {
    let result = await ProductService.remvoeProductService(row.id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== row.id
      ));
      this.setState({ rows });
    }
  }
  showFilter = () => {
    this.setState({ showFilter: true });
  }
  filtering = () => {
    let { rows, filter } = this.state;
    return rows.filter(element => {
      return !filter.types.length || filter.types.includes(element.p_type);
    });
  }
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy, productGroups, types, page, rowsPerPage } = this.state;
    const { vertical, horizontal, open } = this.state;
    let filterData = this.filtering();
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <FusePageSimple
        classes={{
          // header : classes.layoutHeader,
          toolbar: "px-16 sm:px-24"
        }}
        className='product-service-page'
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-12">account_balance</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Product & Service'}</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                className="normal-case" variant="contained" color="primary" aria-label="Send Message"
                onClick={this.showFilter}>Filter</Button>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24 product-service-page">
            <ProductServiceDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
              p_type: '',
              p_name: '',
              d_name: '',
              p_group: '',
              qtyonhand: '',
              p_price: '',
              s_price: '',
              i_account: 5,
              e_account: 4,
              reorder: '',
              barcode: '',
              istaxable: false,
              taxtype: '',
              subledger: '',
              status: false,
              image: ''
            }} />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">{row.p_name}</TableCell>
                      <TableCell align="center">{row.sku}</TableCell>
                      <TableCell align="center">{types[row.p_type].type}</TableCell>
                      <TableCell align="center">{productGroups[row.p_group].group_name}</TableCell>
                      <TableCell align="center">{row.d_name}</TableCell>
                      <TableCell align="center">{row.qtyonhand}</TableCell>
                      <TableCell align="center">{row.barcode}</TableCell>
                      <TableCell align="center">
                        <ProductServiceDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align="center">
                        'No memberships found.'
                                    </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
              <TablePagination
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
              />
            </Paper>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              key={`${vertical},${horizontal}`}
              open={open}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              disableWindowBlurListener={true}
              message={<span id="message-id">Successfully Update!</span>}
            />
            <FilterDialog
              onClose={this.onFilterDialogClose}
              changeFilter={this.changeFilter}
              filter={this.state.filter}
              open={this.state.showFilter} />
          </div>
        }
      />
    );
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: authActions.logoutUser
  }, dispatch);
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user
  }
}
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ProductServicePage));
