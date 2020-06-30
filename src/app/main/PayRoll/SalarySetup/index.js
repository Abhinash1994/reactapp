import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles, Typography, Paper,
  Table, TableBody, TableRow, TableCell
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import EditDialog from './Edit.Dialog';
import { stableSort, getSorting } from '../../../helper/TableSortHepler'

const tableRows = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '50px' },
  { id: 'headName', numeric: false, disablePadding: true, label: 'Head Name' },
  { id: 'ledger_name', numeric: false, disablePadding: false, label: 'Redger Name', width: '150px' },
  { id: 'Taxable', numeric: false, disablePadding: false, label: 'Status', width: '50px' },
  { id: 'actions', numeric: false, disablePadding: false, label: '', width: '50px' },

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


class TaxPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
  };

  componentDidMount() {
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  handleSave = (row, type) => {
    let { rows } = this.state;
    rows.push(row);
    this.setState({ rows });
  }

  handleRemove = (row) => {
  }
  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;
    var data = stableSort(this.state.rows, getSorting(order, orderBy));
    console.log(localStorage.getItem('username'))
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">Salary Setup</Typography>
                </FuseAnimate>
              </div>
            </div>
            <div className="flex items-center justify-end">
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <EditDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
              taxname: '',
              status: '',
            }} />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableRows}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='left'>{row.name}</TableCell>
                      <TableCell align='left'>{`${row.rate}%`}</TableCell>
                      <TableCell align='left'>{row.Status === true ? "Is Active" : "Deactive"}</TableCell>
                      <TableCell align='left'>
                        <EditDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left' colSpan={5}>
                        {'No Tax Setup found.'}
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </Paper>
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(TaxPage));
