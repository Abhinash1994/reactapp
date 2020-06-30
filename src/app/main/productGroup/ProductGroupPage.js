import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, Typography, Icon, Tooltip,Snackbar,
  Table, TableBody, TableSortLabel, TableCell, TableHead, TableRow, Paper
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import ProductGroupDialog from './ProductGroupDialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import ProductGroupService from '../../services/ProductGroupService';
import './style.scss'


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'group_name', numeric: false, disablePadding: true, label: 'Group Name' },
  { id: 'ledger_code', numeric: false, disablePadding: false, label: 'Code' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align="center"
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

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


class ProductGroupPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
  };

  async componentDidMount() {
    let rows = await ProductGroupService.getProductGroups();
    this.setState({ rows });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSave = async (row, type) => {
    if (type === 'edit') {
      let newProductGroup = await ProductGroupService.updateProductGroup(row);
      if (newProductGroup) {
        let rows = await ProductGroupService.getProductGroups();
        this.setState({ rows });
      }
    } else {
      let rows = this.state.rows;
      let newProductGroup = await ProductGroupService.createProductGroup(row);
      if (newProductGroup)
        rows.push(newProductGroup);
      this.setState({ rows });
    }
  }

  handleRemove = async row => {
    let result = await ProductGroupService.remvoeProductGroup(row.id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== row.id
      ))
      this.setState({ rows });
    }
  }
  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;
    const { vertical, horizontal, open } = this.state;
    var data = stableSort(this.state.rows, getSorting(order, orderBy));
    return (
      <FusePageSimple
        classes={{
          // header : classes.layoutHeader,
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-12">date_range</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">Product Group</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">

            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <ProductGroupDialog type='add'
              onSave={this.handleSave}
              onRemove={this.handleRemove}
              onClose={this.handleClose}
              row={{
                group_name: '',
                ledger_code: '',
                status: true,
              }} />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">{row.group_name}</TableCell>
                      <TableCell align="center">{row.ledger_code}</TableCell>
                      <TableCell align="center">{row.status ? 'Is Avtive' : ''}</TableCell>
                      <TableCell align="center">
                        <ProductGroupDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align="center">
                        {'No memberships found.'}
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ProductGroupPage));
