import React, { Component } from 'react';
import {
  withStyles, Typography, Button, TextField, MenuItem, Menu, Fade,
  Table, TableBody, TableCell, TableRow, Paper, Grid
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../../helper/TableSortHepler'
import { SupervisorAccount } from '@material-ui/icons';
import moment from 'moment';
import LabelControl from '../../../components/LabelControl';
import utils from '../../../helper/utils';
import Variables from '../../../../variables'
const tableColumes = [
  { id: 'sn', numeric: false, disablePadding: true, label: 'S.N.' },
  { id: 'dateBs', numeric: false, disablePadding: true, label: 'Date BS' },
  { id: 'dateAd', numeric: false, disablePadding: true, label: 'Date Ad.' },
  { id: 'tansNo', numeric: false, disablePadding: true, label: 'Trans No.' },
  { id: 'remarks', numeric: false, disablePadding: true, label: 'Remarks' },
  { id: 'debit', numeric: false, disablePadding: true, label: 'Debit' },
  { id: 'credit', numeric: false, disablePadding: true, label: 'Credit' },
  { id: 'balance', numeric: false, disablePadding: true, label: 'Balance' },
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

class BankStatementPage extends Component {

  state = {
    order: 'asc',
    orderBy: '',
    rows: [],
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    debit: 0,
    credit: 0,
    filter: {
      datewise: {},
      types: []
    },
    dateType: 'All dates',
    exportMenu: null,
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
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

  showFilter = () => {
    this.setState({ showFilter: true });
  }
  filtering = () => {
    let { rows, filter } = this.state;
    let total = 0;
    let result = rows.filter(element => {
      let flag = (!filter.types.length || filter.types.includes(element.status))
        && (!moment.isMoment(filter.datewise.from) || (moment(element.date) >= filter.datewise.from))
        && (!moment.isMoment(filter.datewise.to) || (moment(element.date) <= filter.datewise.to))
      if (flag) {
        total += element.total;
      }
      return flag;
    });
    return { result, total };
  }
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }
  edit = id => {
    this.setState({
      edit: true,
      editRow: id
    })
  }
  editClose = () => {
    this.setState({
      edit: false,
      editRow: 0
    })
  }
  removeSale = id => {
    let rows = this.state.rows.filter(element => (
      element.id !== id
    ));
    this.setState({ rows, edit: false })
  }
  changeDateRange = name => event => {
    this.setState({
      dateType: 'Custom',
      filter: {
        ...this.state.filter,
        datewise: {
          ...this.state.filter.datewise,
          [name]: moment(event.target.value)
        }
      }
    });
  }
  changeDate = (event) => {
    this.setState({
      dateType: event.target.value,
      filter: {
        ...this.state.filter,
        datewise: utils.getDateRange(event.target.value)
      }
    })
  }
  handelExport = event => {
    this.setState({
      exportMenu: event.currentTarget
    })
  }
  handleMenuClose = () => {
    this.setState({
      exportMenu: null
    })
  }
  render() {
    const { classes } = this.props;
    const { dateTypes } = Variables;
    const { order, orderBy, filter, dateType, exportMenu } = this.state;
    let filterData = this.filtering();
    let data = stableSort(filterData.result, getSorting(order, orderBy));
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
                  <SupervisorAccount className="text-32 mr-12" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Cash Book'}</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper className={`${classes.root} mb-16`} style={{ padding: '1em' }}>
              <Grid container>
                <Grid item xs={3}>
                  <LabelControl label='Date'>
                    <TextField
                      select
                      variant='outlined'
                      value={dateType || ''}
                      onChange={this.changeDate}
                    >
                      {dateTypes.map((element, index) => (
                        <MenuItem value={element} key={index}>{element}</MenuItem>
                      ))}
                    </TextField>
                  </LabelControl>
                </Grid>
                <Grid item xs={3}>
                  {moment.isMoment(filter.datewise.from) &&
                    <LabelControl label='From'>
                      <TextField
                        type='date'
                        variant='outlined'
                        value={filter.datewise.from.format('YYYY-MM-DD') || ''}
                        onChange={this.changeDateRange('from')}
                      />
                    </LabelControl>}
                </Grid>
                <Grid item xs={3}>
                  {moment.isMoment(filter.datewise.to) &&
                    <LabelControl label='To'>
                      <TextField
                        type='date'
                        variant='outlined'
                        value={filter.datewise.to.format('YYYY-MM-DD') || ''}
                        onChange={this.changeDateRange('to')}
                      />
                    </LabelControl>}
                </Grid>
                <Grid item xs={3} className='flex items-center justify-end'>
                  <Button className='text-transform-none'>View</Button>
                </Grid>
              </Grid>
            </Paper>
            <Paper className={classes.root} style={{ padding: '1em' }}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row.id} className='change-row' onClick={() => this.edit(row.id)}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{moment(row.dateBs).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell align="left">{moment(row.DateAd).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell align="left">{row.tranNo || ''}</TableCell>
                      <TableCell align="left">{row.remarks || ''}</TableCell>
                      <TableCell align="left">{row.debit || '-'}</TableCell>
                      <TableCell align="left">{row.credit || '-'}</TableCell>
                      <TableCell align="left">{row.balance}</TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 &&
                    <TableRow>
                      <TableCell align="center" colSpan={8}>
                        {'No Bank statement found.'}
                      </TableCell>
                    </TableRow>
                  }
                  <TableRow>
                    <TableCell align='right' colSpan={8}>
                      <Button className='text-transform-none'>Print</Button>
                      <Button
                        className='text-transform-none'
                        aria-controls="export-menu"
                        aria-haspopup="true"
                        onClick={this.handelExport}
                      >
                        {'Export'}
                      </Button>
                      <Menu
                        id="export-menu"
                        anchorEl={exportMenu}
                        keepMounted
                        open={Boolean(exportMenu)}
                        onClose={this.handleMenuClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={this.handleMenuClose}>Excel</MenuItem>
                        <MenuItem onClick={this.handleMenuClose}>PDF</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
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
          </ div>
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(BankStatementPage));
