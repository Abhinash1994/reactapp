import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Icon, Tooltip } from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BranchDialog from './BranchDialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Snackbar from '@material-ui/core/Snackbar';
import BranchService from '../../services/BranchService';

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'branchcode', numeric: false, disablePadding: false, label: 'BranchCode' },
  { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
  { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
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

class BranchPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await BranchService.getAllBranch();
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
      await BranchService.updateBranch(row);
      let rows = await BranchService.getAllBranch();
      console.log(rows);
      this.setState({ rows, open: true });
    } else {
      let newBranch = await BranchService.createBranch(row);
      var rows = this.state.rows;
      rows.push(newBranch);
      this.setState({ rows, open: true });
    }
  }

  handleRemove = async row => {
    await BranchService.removeBranch(row.branch_Id);
    let rows = this.state.rows.filter(r => (
      r.branch_Id !== row.branch_Id
    ))
    this.setState({ rows });
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
                  <Icon className="text-32 mr-12">call_split</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">Branch</Typography>
                </FuseAnimate>
              </div>
            </div>

            <div className="flex items-center justify-end">

            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <BranchDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
              branch_Name: '',
              branch_Code: '',
              address: '',
              telephone_No: '',
              email_Id: '',
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
                    <TableRow key={row.branch_Id}>
                      <TableCell align="center">{row.branch_Name}</TableCell>
                      <TableCell align="center">{row.branch_Code}</TableCell>
                      <TableCell align="center">{row.address}</TableCell>
                      <TableCell align="center">{row.telephone_No}</TableCell>
                      <TableCell align="center">{row.email_Id}</TableCell>
                      <TableCell align="center">
                        <BranchDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(BranchPage));
