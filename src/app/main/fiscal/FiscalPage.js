import React, { Component } from 'react';
import {
  withStyles, Typography, Icon, Snackbar,
  Table, TableBody, TableCell, TableRow, Paper
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import FiscalDialog from './FiscalDialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import FiscalService from '../../services/FiscalService';
import moment from 'moment';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'

import './style.scss'

const tableRows = [
  { id: 'fiscalyear', numeric: false, disablePadding: true, label: 'Fiscal Year' },
  { id: 'fromdate', numeric: false, disablePadding: false, label: 'From Date', width: '150px' },
  { id: 'todate', numeric: false, disablePadding: false, label: 'To Date', width: '150px' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', width: '100px' },
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


class FiscalPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
  };

  async componentDidMount() {
    let rows = await FiscalService.getAllFiscal();
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

  handleLogoChange = (e) => {
    this.setState({
      Logo: e.target.files[0]
    })
    // alert(e.target.files[0])
  }

  handleSave = async (row, type) => {
    if (type === 'edit') {
      let newFiscal = await FiscalService.updateFiscal(row);
      if (newFiscal) {
        let rows = await FiscalService.getAllFiscal();
        this.setState({ rows });
      }
    } else {
      let rows = this.state.rows;
      let newFiscal = await FiscalService.createFiscal(row);
      if (!!newFiscal.status) {
        rows.forEach(row => {
          row.status = false;
        })
      }
      rows.push(newFiscal);
      this.setState({ rows });
    }
  }

  handleRemove = async row => {
    let result = await FiscalService.removeFiscal(row.fiscal_Id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.fiscal_Id !== row.fiscal_Id
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
                  <Typography variant="h6" className="hidden sm:flex">Fiscal Year</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">

            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <FiscalDialog type='add'
              onSave={this.handleSave}
              onRemove={this.handleRemove}
              onClose={this.handleClose}
              row={{
                fiscalyear: '',
                fromdate: moment().format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
                status: true,
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
                  {data.map(row => (
                    <TableRow key={row.fiscal_Id}>
                      <TableCell component="th" scope="row">{row.fiscalyear}</TableCell>
                      <TableCell align='left'>{moment(row.fromdate).format("YYYY-MM-DD")}</TableCell>
                      <TableCell align='left'>{moment(row.todate).format("YYYY-MM-DD")}</TableCell>
                      <TableCell align='left'>{row.status ? 'Is Avtive' : ''}</TableCell>
                      <TableCell align='left'>
                        <FiscalDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left'>
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(FiscalPage));
