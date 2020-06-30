import React, { Component } from 'react';
import {
  withStyles, Typography, Icon,
  Table, TableBody, TablePagination, TableCell, TableRow, Paper, Button
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import TodoListDialog from './Edit.Dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import EnhancedTableHead from '../../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../../helper/TableSortHepler'
import moment from 'moment';
import { ProjectService } from '../../../services';
import FilterDialog from './filter.dialog';
// import './style.scss'
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
  { id: 'no', numeric: false, disablePadding: true, label: '#', width: '50px' },
  { id: 'Task', numeric: false, disablePadding: false, label: 'Task', width: '' },
  { id: 'dueDate', numeric: false, disablePadding: false, label: 'Due Date', width: '150px' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Start', width: '100px' },
  { id: 'assign_to', numeric: false, disablePadding: false, label: 'Assign To', width: '150px' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', width: '100px' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', width: '100px' },
];

class ProjectPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      order: 'asc',
      orderBy: 'monthly_rate',
      page: 0,
      rowsPerPage: 10,
      rows: [],
      employeeList: [],
      open: false,
      vertical: 'center',
      horizontal: 'center',
      showFilter: false,
      filter: {
        user: 'all',
        from: '',
        to: '',
        types: []
      }
    };
    this.displayData = this.displayData.bind(this);
  }


  async componentDidMount() {
    // let rows = await ProjectService.getAllProjects();
    // this.setState({ rows });
    await this.displayData();
  }

  async displayData() {
    let dataList = await ProjectService.getAllTasks();

    var emp = await ProjectService.getEmployeeNames();
    emp.forEach(element => {
      var ele = [];
      ele.id = element.id;
      ele.name = element.name;
      // employeeList.push(ele);
    })

    let { rows, employeeList } = this.state;
    rows = [];

    dataList.forEach(element => {
      var row = [];
      row.id = element.id;
      row.task = element.task;
      row.dueDate = element.due_date;
      row.startDate = element.start_date;
      row.assign_to = element.assign_to;
      row.status = element.status;
      row.remark = element.remark;
      row.Assign_to = element.assign_to;
      rows.push(row);
    })

    this.setState({ rows, employeeList });
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
    await this.displayData();
  }

  handleRemove = async row => {
  }

  onFilterDialogClose = () => {
    this.setState({ showFilter: false });
  }

  changeFilter = (filter) => {
    this.setState({ filter });
    this.onFilterDialogClose();
  }
  handleClose = () => {
    this.setState({ open: false });
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
  }

  showFilter = () => {
    this.setState({ showFilter: true });
  }

  filterTask = () => {
    let { rows, filter } = this.state;
    var filterIds = [];
    filter.types.forEach(element => {
      if (element === "Due") {
        filterIds.push(0);
      }
      else if (element === "In Progress") {
        filterIds.push(1)
      }
      else if (element === "Done") {
        filterIds.push(2)
      }
    })
    return rows.filter(element => {
      return (!filterIds.length || (filterIds.includes(element.status) && filterIds.includes(element.status) && filterIds.includes(element.status)))
    });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;
    var filterData = this.filterTask();
    var data = stableSort(filterData, getSorting(order, orderBy));
    return (
      <FusePageSimple
        classes={{
          // header : classes.layoutHeader,
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            
          </div>
        }
        content={
          <div className="p-16 sm:p-16">
            
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ProjectPage));
