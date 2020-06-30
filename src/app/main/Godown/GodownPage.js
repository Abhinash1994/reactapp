import React, { Component } from 'react';
import {
  withStyles, Typography, Icon,
  Table, TableBody, TableCell, TableRow, Paper
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import GodownDialog from './GodownDialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import GoDownService from '../../services/GoDownService';
import './style.scss'
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

const tableRows = [
  { id: 'GoDown_Name', numeric: false, disablePadding: true, label: 'GoDown Name', width: '' },
  { id: 'GoDown_Code', numeric: false, disablePadding: false, label: 'Code', width: '150px' },
  { id: 'Remarks', numeric: false, disablePadding: false, label: 'Remarks', width: '150px' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', width: '150px' },
  { id: 'action', numeric: false, disablePadding: false, label: '', width: '100px' },
];

class GodownPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'asc',
      orderBy: 'monthly_rate',
      rows: [],
      open: false,
      vertical: 'center',
      horizontal: 'center',
    };
    this.displayData = this.displayData.bind(this);
  }


  async componentDidMount() {
    this.displayData();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  async displayData() {
    var GoDown = await GoDownService.getAllGodown();
    let { rows } = this.state;
    rows = [];
    await GoDown.forEach(element => {
      rows.push(element);
    });
    this.setState({ rows });
  }

  handleSave = async (row, type) => {
    this.displayData();
  }

  handleRemove = async row => {
    await GoDownService.removeGodown(row.Id);
    // if (result) {
    //   let rows = this.state.rows.filter(element => (
    //     element.id !== row.id
    //   ))
    //   this.setState({ rows });
    // }
    await this.displayData();
  }
  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;
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
                  <Icon className="text-32 mr-12">date_range</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">GoDown</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-16">
            <GodownDialog type='add'
              onSave={this.handleSave}
              onRemove={this.handleRemove}
              onClose={this.handleClose}
              row={{
                GoDown_Name: '',
                GoDown_Code: '',
                Remarks: '',
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
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">{row.goDown_Name}</TableCell>
                      <TableCell align="left">{row.goDown_Code}</TableCell>
                      <TableCell align="left">{row.Remarks}</TableCell>
                      <TableCell align="left">{row.status === 0 ? "Closed" : row.status === "1" ? "In Progress" : "Open"}</TableCell>
                      <TableCell align="left">
                        <GodownDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align="center">
                        {'No GoDown.'}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(GodownPage));
