import React, { Component } from 'react';
import {
  withStyles, Typography, Icon,
  Table, TableBody, TableCell, TableRow, Paper, TablePagination
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationManager } from 'react-notifications';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import EditDialog from './Edit.Dialog'
import './style.scss'
import AutoNumberingService from '../../services/AutoNumberingService';
const tableColumes = [
  { id: 'no', numeric: false, disablePadding: true, label: 'No', width: '20px' },
  { id: 'type', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'startingword', numeric: false, disablePadding: false, label: 'Starting word', width: '250px' },
  { id: 'length', numeric: false, disablePadding: false, label: 'Length', width: '150px' },
  { id: 'starting_no', numeric: false, disablePadding: false, label: 'Starting No', width: '150px' },
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

class AutoNumbering extends Component {

  state = {
    order: 'asc',
    orderBy: 'name',
    rows: [],
    editRow: 0,
    page: 0,
    rowsPerPage: 10,
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await AutoNumberingService.getAutoNumbers();
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
      let newData = await AutoNumberingService.updateAutoNumber(row);
      if (!!newData) {
        let rows = await AutoNumberingService.getAutoNumbers();
        this.setState({ rows });
        NotificationManager.error("Successful updated", "Update");
      }
    } else {
      let newData = await AutoNumberingService.createAutoNumber(row);
      if (newData) {
        let rows = this.state.rows;
        rows.push(newData);
        this.setState({ rows });
        NotificationManager.error("Successful created", "Create");
      }
    }
  }

  handleRemove = async row => {
    let result = await AutoNumberingService.remvoeAutoNumber(row.id);
    if (result) {
      let rows = this.state.rows.filter(element => (
        element.id !== row.id
      ));
      this.setState({ rows });
      NotificationManager.error("Successful removed", "Remove");
    }
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }
  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;
    let filterData = this.state.rows;
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
                  <Icon className="text-32 mr-12">formart_list</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Auto Numbering'}</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24 ">
            <EditDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{
              username: '',
              useremail: '',
              branch_Id: '',
              emp_Id: '',
              password: '',
              status: 0,
              createdBy: -1
            }} />
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
                    <TableRow key={row.id}>
                      <TableCell align='left'>{index + 1}</TableCell>
                      <TableCell align='left'>{row.type}</TableCell>
                      <TableCell align='left'>{row.startingword || ''}</TableCell>
                      <TableCell align='left'>{row.length || 0}</TableCell>
                      <TableCell align='left'>{row.starting_no || 0}</TableCell>
                      <TableCell align='left'>
                        <EditDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align='left' colSpan={6}>
                        {'No auto numer list found.'}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AutoNumbering));
