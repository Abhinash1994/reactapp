import React, { Component } from 'react';
import {
  withStyles, Typography, Icon, Input, Button,
  Table, TableBody, TableCell, TableRow, Paper, Snackbar, TablePagination
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationManager } from 'react-notifications';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import UserDialog from './User.dialog';
import UserService from '../../services/UserService';
import BranchService from '../../services/BranchService';
import RoleService from '../../services/RoleService';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import FilterDialog from './Filter.dialog'
import './style.scss'
const tableColumes = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '20px' },
  { id: 'username', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'useremail', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'rolename', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'emp_Id', numeric: false, disablePadding: false, label: 'Employee' },
  { id: 'branch_Id', numeric: false, disablePadding: false, label: 'Branch' },
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

class UserPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'name',
    rows: [],
    editRow: 0,
    branchs: [],
    roles: [],
    branchsMap: {},
    rolesMap: {},
    productGroups: {},
    page: 0,
    rowsPerPage: 10,
    searchText: '',
    types: {},
    open: false,
    vertical: 'center',
    horizontal: 'center',
    showFilter: false,
    filter: {
      name_email: '',
      roles: [],
      createFrom: '',
      createTo: '',
      branchs: []
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await UserService.getAllUsers();
    let branchs = await BranchService.getAllBranch();
    let roles = await RoleService.getAllRoles();
    let branchsMap = {};
    let rolesMap = {};
    branchs.forEach(element => {
      branchsMap[element.branch_Id] = element;
    });
    roles.forEach(element => {
      rolesMap[element.roll_Id] = element;
    });
    this.setState({ rows, branchs, branchsMap, roles, rolesMap });
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
      let newUser = await UserService.updateUser(row);
      if (!!newUser) {
        let rows = await UserService.getAllUsers();
        this.setState({ rows });
        NotificationManager.error("Successful updated", "Update");
      }
    } else {
      let newUser = await UserService.createUser(row);
      if (newUser) {
        let rows = this.state.rows;
        rows.push(newUser);
        this.setState({ rows });
        NotificationManager.error("Successful created", "Create");
      }
    }
  }

  handleRemove = async row => {
    let result = await UserService.deleteUser(row.user_Id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.user_Id !== row.user_Id
      ));
      this.setState({ rows });
      NotificationManager.error("Successful removed", "Remove User");
    }
  }
  showFilter = () => {
    this.setState({ showFilter: true });
  }
  filterUser = () => {
    let { rows, searchText, filter } = this.state;
    let search = searchText.toLowerCase();
    return rows.filter(element => {
      // let username = users[element.username] ? users[element.username].username : 'Deleted User';
      return (
        element.username.toLowerCase().includes(search)
        || element.useremail.toLowerCase().includes(search)
      )
        // && (!moment.isMoment(filter.createFrom) || (moment(element.created_by) >= filter.createFrom))
        // && (!moment.isMoment(filter.createTo) || (moment(element.created_by) <= filter.createTo))
        && (!filter.roles.length || filter.roles.includes(element.roll_Id))
        && (!filter.branchs.length || filter.branchs.includes(element.branch_Id))
    });
  }
  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }
  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
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
  render() {
    const { classes } = this.props;
    const { order, orderBy, rolesMap, branchsMap } = this.state;
    const { vertical, horizontal, open, page, rowsPerPage } = this.state;
    let filterData = this.filterUser();
    let data = stableSort(filterData, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
                  <Icon className="text-32 mr-12">account_balance</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Users'}</Typography>
                </FuseAnimate>
              </div>
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
            <div className="flex items-center justify-end">
              <Button
                className="normal-case" variant="contained" color="primary" aria-label="Send Message"
                onClick={this.showFilter}>Filter</Button>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24 ">
            <UserDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{
              username: '',
              useremail: '',
              branch_Id: '',
              emp_Id: '',
              password: '',
              status: 0,
              created_by: 0
            }} branchs={this.state.branchs} roles={this.state.roles} />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row.user_Id}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='left'>{row.username}</TableCell>
                      <TableCell align='left'>{row.useremail}</TableCell>
                      <TableCell align='left'>{rolesMap[row.roll_Id] && rolesMap[row.roll_Id].rollname}</TableCell>
                      <TableCell align='left'>{row.emp_Id}</TableCell>
                      <TableCell align='left'>{branchsMap[row.branch_Id] && branchsMap[row.branch_Id].branch_Name}</TableCell>
                      <TableCell align='left'>
                        <UserDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row}
                          branchs={this.state.branchs} roles={this.state.roles} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left' colSpan={7}>
                        {'No Users found.'}
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
              open={this.state.showFilter}
              roles={this.state.roles}
              branchs={this.state.branchs}
              branchsMap={this.state.branchsMap}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(UserPage));
