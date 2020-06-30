import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles, Paper, Table, TableBody, TableRow, TableCell
} from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import TaxDialog from './Tax.Dialog';
import { stableSort, getSorting } from '../../../helper/TableSortHepler'
import TaxService from '../../../services/TaxService';

const tableRows = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '50px' },
  { id: 'taxname', numeric: false, disablePadding: true, label: 'Tax Name' },
  { id: 'typeStr', numeric: false, disablePadding: true, label: 'Type' },
  { id: 'taxrate', numeric: false, disablePadding: false, label: 'Tax Rate', width: '150px' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', width: '50px' },
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

  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'monthly_rate',
      rows: [],
      open: false,
      vertical: 'center',
      horizontal: 'center',
    };
    this.getTaxList = this.getTaxList.bind(this);
    this.resetRows = this.resetRows.bind(this);
  }

  componentDidMount() {
    this.getTaxList();
  }

  resetRows() {
    let { rows } = this.state;
    rows = [];
    this.setState({ rows });
  }

  async getTaxList() {
    var TaxList = await TaxService.getTaxList();
    let { rows } = this.state;
    rows = [];
    TaxList.forEach(element => {
      let Tax = [];
      Tax.id = element.id;
      Tax.name = element.name;
      Tax.type = element.type;
      if (element.type === 1)
        Tax.typeStr = 'Vat';
      else if (element.type === 2)
        Tax.typeStr = 'TDS';
      else if (element.type === 3)
        Tax.typeStr = 'Income Tax';
      Tax.rate = element.rate;
      Tax.status = element.status;
      rows.push(Tax);
    });
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
    this.getTaxList();
    // let { rows } = this.state;
    // let Tax = [];
    // Tax.id = row.id;
    // Tax.name = row.name;
    // Tax.type = row.type;
    // Tax.rate = row.rate;
    // Tax.status = row.status;
    // rows.push(Tax);
    // this.setState({ rows });
  }

  handleRemove = async (row) => {
    if (row.id === undefined || row.id === 0) {
      return;
    }
    await TaxService.removeTax(row.id);
    this.resetRows();
    this.getTaxList();
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
        content={
          <div className="p-16 sm:p-24">
            <TaxDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
              taxname: '',
              status: '',
            }} />
            <Paper>
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
                      <TableCell align='left'>{row.typeStr}</TableCell>
                      <TableCell align='left'>{`${row.rate}%`}</TableCell>
                      <TableCell align='left'>{row.status === true ? "Is Active" : "Deactive"}</TableCell>
                      <TableCell align='left'>
                        <TaxDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
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
