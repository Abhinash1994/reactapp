import React, { Component } from 'react';
import {
  withStyles, Typography, Icon, Input, Button,
  Table, TableBody, TableCell, TableRow, Paper, Snackbar, TablePagination
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import UserLogService from '../../services/UserLogService';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import moment from 'moment';
import './style.scss'
import UserService from '../../services/UserService';
import FilterDialog from './Filter.dialog';

const tableColumes = [
  { id: 'datetime', numeric: false, disablePadding: true, label: 'Date TIme' },
  { id: 'username', numeric: false, disablePadding: false, label: 'User Name' },
  { id: 'event', numeric: false, disablePadding: false, label: 'Event' },
  // { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
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

class UserLog extends Component {

  state = {
    order: 'asc',
    orderBy: 'name',
    rows: [],
    users: {},
    open: false,
    vertical: 'center',
    horizontal: 'center',
    page: 0,
    rowsPerPage: 10,
    searchText: '',
    isStartDate: false,
    isEndDate: false,
    startDate: moment(),
    endDate: moment(),
    showFilter: false,
    filter: {
      user: 'all',
      from: '',
      to: '',
      types: []
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await UserLogService.getUserLogs()
    let usersArray = await UserService.getAllUsers();
    let users = {};
    usersArray.forEach(element => {
      users[element.user_Id] = element;
    });
    this.setState({ rows, users });
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
      await UserLogService.updateUserLog(row);
      let rows = await UserLogService.getUserLogs();
      this.setState({ rows });
    } else {
      let newUserLogService = await UserLogService.createUserLog(row);
      if (newUserLogService) {
        let rows = await UserLogService.getUserLogs();
        this.setState({ rows });
      }
    }
  }

  handleRemove = async row => {
    let result = await UserLogService.remvoeUserLog(row.sn);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.sn !== row.sn
      ));
      this.setState({ rows });
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }
  setSearchText = event => {
    this.setState({
      searchText: event.target.value
    })
  }
  handleChange = name => event => {
    switch (name) {
      default:
        this.setState({ [name]: event.target.value });
    }
  }
  showFilter = () => {
    this.setState({ showFilter: true });
  }
  filterLog = () => {
    let { rows, searchText, users, filter } = this.state;
    let search = searchText.toLowerCase();
    return rows.filter(element => {
      let username = users[element.username] ? users[element.username].username : 'Deleted User';
      return (filter.user === 'all' || username === this.props.user.username)
        && username.toLowerCase().includes(search)
        && (!moment.isMoment(filter.from) || (moment(element.datetime) >= filter.from))
        && (!moment.isMoment(filter.to) || (moment(element.datetime) <= filter.to))
        && (!filter.types.length || filter.types.includes(element.event))
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
    const { order, orderBy, users, page, rowsPerPage } = this.state;
    const { vertical, horizontal, open } = this.state;
    let filterData = this.filterLog();
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24"
        }}
        className='product-service-page'
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center user-log-header">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-12">account_balance</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'User Log'}</Typography>
                </FuseAnimate>
              </div>
              <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Paper
                    className="flex p-4 items-center w-full max-w-512 px-8 py-4"
                    elevation={1}>
                    <Icon className="mr-8" color="action">{'search'}</Icon>
                    <Input
                      placeholder="Search for anything"
                      className="flex flex-1"
                      disableUnderline
                      fullWidth
                      value={this.state.searchText || ''}
                      inputProps={{
                        "aria-label": "Search"
                      }}
                      onChange={this.setSearchText}
                    />
                  </Paper>
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
                    <TableRow key={row.sn}>
                      <TableCell component="th" scope="row">{moment(row.datetime).format("YYYY-MM-DD hh:mm")}</TableCell>
                      <TableCell align='left'>{users[row.username] ? users[row.username].username : 'Deleted User'}</TableCell>
                      <TableCell align='left'>{`${row.activity} ${row.type} ${row.event}`}</TableCell>
                      {/* <TableCell align='left'>{row.type}</TableCell> */}
                      {/* <TableCell align='left'>
                        <UserLogDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove}
                          row={{ ...row, username: users[row.username] ? users[row.username].username : 'Deleted User' }} />
                      </TableCell> */}
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left'>
                        {'No log found.'}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(UserLog));
