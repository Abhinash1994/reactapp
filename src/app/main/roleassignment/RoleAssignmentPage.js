import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FusePageSimple, FuseAnimate } from '@fuse';

import {
  withStyles, Typography, Icon, Tooltip,
  Table,
  TableBody,
  TableSortLabel,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem
} from '@material-ui/core';
import { Check, Lock } from '@material-ui/icons';
import RoleAssignmentDialog from './RoleAssignmentDialog'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Snackbar from '@material-ui/core/Snackbar';
import AuthRoleService from '../../services/AuthRoleService';
import RoleService from '../../services/RoleService';
import { NotificationManager } from 'react-notifications';

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
  { id: 'menu', numeric: false, disablePadding: true, label: 'Role' },
  { id: 'viewRole', numeric: false, disablePadding: true, label: 'View' },
  { id: 'saveRole', numeric: false, disablePadding: true, label: 'Save' },
  { id: 'updateRole', numeric: false, disablePadding: true, label: 'Update' },
  { id: 'deleteRole', numeric: false, disablePadding: true, label: 'Delete' },
  { id: 'printRole', numeric: false, disablePadding: true, label: 'Print' }
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


class RoleAssignmentPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    roles: [],
    role: 0,
    open: false,
    vertical: 'center',
    horizontal: 'center',
  };

  async componentDidMount() {
    let roles = await RoleService.getAllRoles();
    if (roles.length) {
      let rows = await AuthRoleService.getAuthRoles(roles[0].roll_Id);
      this.setState({ rows, roles, role: roles[0].roll_Id });
    }
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

  handleSave = async (row, type, checked) => {
    if (type === 'edit') {
      await AuthRoleService.updateAuthRole(row);
      let rows = await AuthRoleService.getAuthRoles(this.state.role);
      this.setState({ rows });
    } else {
      if (this.state.role) {
        let checkMenu = this.state.rows.filter(element => (
          element.menu === row.menu
        ));
        if (checkMenu.length) {
          NotificationManager.error(`${row.menu} is contained this role assigment.`);
          return;
        }
        let newAuthRole = await AuthRoleService.createAuthRole({ roll_Id: this.state.role, ...row });
        if (newAuthRole) {
          let rows = this.state.rows;
          rows.push(newAuthRole);
          this.setState({ rows });
        }
      } else {
        NotificationManager.error("Please select Role Group!");
      }
    }
  }

  handleRemove = async row => {
    let result = await AuthRoleService.removeAuthRole(row.id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== row.id
      ));
      this.setState({ rows });
    }
  }
  handleClose = () => {
    this.setState({ open: false });
  }
  handleRoleChange = async event => {
    let rows = await AuthRoleService.getAuthRoles(event.target.value);
    this.setState({ role: event.target.value, rows });
  };

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
                  <Icon className="text-32 mr-12">person_pin_circle</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">Role Assignment</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">

            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <div className='auth-role-header'>
              <div className='select-role'>
                <TextField
                  className="mb-24"
                  select
                  value={this.state.role}
                  onChange={this.handleRoleChange}
                  fullWidth
                >
                  {
                    this.state.roles.map((item, index) => (
                      <MenuItem value={item.roll_Id} key={item.roll_Id}>{item.rollname}</MenuItem>
                    ))
                  }
                </TextField>
              </div>
              <RoleAssignmentDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
                saveRole: false,
                viewRole: true,
                deleteRole: false,
                updateRole: false,
                printRole: false
              }} />

            </div>
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
                      <TableCell align="center">{row.menu}</TableCell>
                      <TableCell align="center">{row.viewRole === true ? <Check /> : <Lock />}</TableCell>
                      <TableCell align="center">{row.saveRole === true ? <Check /> : <Lock />}</TableCell>
                      <TableCell align="center">{row.updateRole === true ? <Check /> : <Lock />}</TableCell>
                      <TableCell align="center">{row.deleteRole === true ? <Check /> : <Lock />}</TableCell>
                      <TableCell align="center">{row.printRole === true ? <Check /> : <Lock />}</TableCell>
                      <TableCell align="center">
                        <RoleAssignmentDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(RoleAssignmentPage));
