import React, { Component } from 'react';
import {
  withStyles, Typography, Icon,
  Table, TableBody, TableCell, TableRow, Paper
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import UserRoleDialog from './UserRoleDialog'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import RoleService from '../../services/RoleService'
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
const tableRows = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '50px' },
  { id: 'Role', numeric: false, disablePadding: true, label: 'Role' },
  { id: 'Status', numeric: false, disablePadding: false, label: 'Status', width: '100px' },
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


class UserRolePage extends Component {

  state = {
    order: 'asc',
    orderBy: '',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
    message: ''
  };

  async componentDidMount() {
    let rows = await RoleService.getAllRoles();
    console.log(rows);
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

  handleSave = async (row, type, checked) => {
    try {
      var res = [];
      this.setState({ status: checked })
      if (type === 'edit') {
        let rows = await RoleService.updateRole({
          roll_Id: row.roll_Id,
          rollname: row.rollname,
          status: checked
        });
        if (rows) {
          this.setState({ rows });
        }
      } else {
        let rows = await RoleService.createRole({
          rollname: row.rollname,
          status: checked
        });
        this.setState({ rows });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  handleRemove = async row => {
    let rows = await RoleService.deleteRole({ roll_Id: row.roll_Id })
    if (rows) {
      this.setState({ rows });
    }
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
                  <Typography variant="h6" className="hidden sm:flex">User Role</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">

            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <UserRoleDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{
              rollname: '',
              status: false,
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
                    <TableRow key={row.roll_Id}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='left'>{row.rollname}</TableCell>
                      <TableCell align='left'>{row.status === true ? "Is Active" : "Deactive"}</TableCell>
                      <TableCell align='left'>
                        <UserRoleDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left' colSpan={4}>
                        {'No Role found.'}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(UserRolePage));
