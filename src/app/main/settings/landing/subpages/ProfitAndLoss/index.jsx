import React, { Component } from 'react';
import {
  withStyles, IconButton, Icon, Button, MenuItem, Paper, Grid, Typography
} from '@material-ui/core';
import ReactExport from "react-data-export";

import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import moment from 'moment';
import utils from '../../../../../helper/utils';
import Variables from '../../../../../../variables'
import TransactionService from '../../../../../services/TransactionService';
import {
  AccountMasterService,
  ChartOfAccountService,
  PrintService,
  ProjectService,
  BranchService
} from '../../../../../services';
import { CustomSelect, CustomTextField } from '../../../../../components/';

import ListItem from '../ListItem';

const styles = theme => ({
  layoutHeader: {
    height: 64,
    minHeight: 64,
    [theme.breakpoints.down('md')]: {
      height: 64,
      minHeight: 64
    }
  }
});

class TrialBalance extends Component {
  state = {
    rows: [],
    banks: [],
    projects: [],
    branches: [],
    chartofaccs: [],
    accountMaster: [],
    getBalanceData: {},
    balanceData: {},
    transactionlist: [],
    page: 0,
    rowsPerPage: 10,
    showFilter: false,
    debit: 0,
    credit: 0,
    filter: {
      datewise: utils.getDateRange('Today'),
      types: []
    },
    fromData: null,
    toDate: null,
    dateType: 'Today',
    bank: 0,
    exportMenu: null,
    project: '-all-project',
    branch: '-all-branches',
    type: '',
    showKeys: [300, 400]
    // showFilter: false
  };

  handleClose = () => {
    this.setState({ showFilter: false });
  }

  async componentDidMount() {
    await this.getBalanceData();
  }

  /**
   * make balance data
   */
  getBalanceData = async () => {
    this.handleClose();
    const projects = await ProjectService.getAllProjects();
    const branches = await BranchService.getAllBranch();
    const chartofaccs = await ChartOfAccountService.getChartOfAccounts();
    const accountMaster = await AccountMasterService.getAllAccountMaster();
    const tList = await TransactionService.getTransactions();
    const { branch, project, filter, type, showKeys } = this.state;
    let balanceData = {};
    for (let list of accountMaster) {

      let objectKey = Variables.mastGroup[list.mast_code].label;
      if (!balanceData[objectKey]) balanceData[objectKey] = { title: objectKey, children: [], debit: 0, credit: 0, type: list.mast_code, isBold: true };


      //filtering data
      let childrenData = chartofaccs.filter(list_coa => list.ledger_Group === list_coa.ledger_Group)
        .map(list => ({ title: list.ledger_name, ledger_Code: list.ledger_Code, debit: 0, credit: 0 }));


      let totalDebit = 0, totalCredit = 0;
      let children = [];
      for (const child of childrenData) {


        const lists = tList.filter(
          element => child.ledger_Code === element.ledger_Code
            && (project === '-all-project' || element.project_id === project)
            && (branch === '-all-branches' || element.branch_id === branch)
            && (!moment.isMoment(filter.datewise.from) || (moment(element.date) >= filter.datewise.from))
            && (!moment.isMoment(filter.datewise.to) || (moment(element.date) <= filter.datewise.to))
            && (type !== 'Opening' || element.tran_type === "OP")
        );
        let debit = 0, credit = 0;
        for (let list of lists) {
          debit += list.debit;
          credit += list.credit;
        }
        child.debit = debit;
        child.credit = credit;
        child.type = list.mast_code;
        totalDebit += debit;
        totalCredit += credit;
        if (debit - credit)
          children.push(child);
      }
      children.push({ title: `Total ${list.group_name}`, debit: totalDebit, credit: totalCredit, type: list.mast_code, isBold: true });
      balanceData[objectKey].debit += totalDebit;
      balanceData[objectKey].credit += totalCredit;
      if (children.length > 1)
        balanceData[objectKey].children.push({
          title: list.group_name, children, debit: totalDebit, credit: totalCredit, type: list.mast_code
        });
    }
    // let allDebit = 0, allCredit = 0;
    for (let keyValue of showKeys) {
      const key = Variables.mastGroup[keyValue].label
      // allDebit += Number(balanceData[key].debit);
      // allCredit += Number(balanceData[key].credit);
      balanceData[key].children.push({
        title: `Total ${key}`,
        debit: balanceData[key].debit,
        credit: balanceData[key].credit,
        type: balanceData[key].type,
        isBold: true
      });
    }
    console.log(balanceData);
    const netEarning = Number(balanceData['Income'].credit-balanceData['Income'].debit) - Number(balanceData['Expenses'].debit-balanceData['Expenses'].credit);
    balanceData['Net earning'] = {
      title: 'Net Earning', debit: netEarning, credit: 0, isBold: true, type: 400
    };
    balanceData['Total'] = {
      title: 'Total', debit: Number(balanceData['Expenses'].debit) + netEarning, credit: 0, isBold: true, type: 400
    };
    console.log(balanceData);
    this.setState({
      projects, branches, chartofaccs, balanceData, accountMaster
    })
  }


  ExportPdf = () => {
    let { balanceData } = this.state;
    PrintService.printBalanceReport('Profit & Loss', balanceData);
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

  changeType = (event) => {
    this.setState({
      type: event.target.value
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

  handleChangeBranch = (e) => {
    this.setState({ branch: e.target.value })
  }

  handleChangeProject = (e) => {
    this.setState({ project: e.target.value })
  }

  render() {
    const { classes } = this.props;
    const { dateTypes, trialBallTypes } = Variables;
    const { filter, dateType, type, balanceData, showFilter, showKeys } = this.state;
    const renderBalance = () => {

      return (
        <>
          {showKeys.map(key => (
            balanceData[Variables.mastGroup[key].label] && <ListItem key={key} listData={balanceData[Variables.mastGroup[key].label]} collapse />
          ))}
          {balanceData['Net earning'] && <ListItem key={'Net earning'} listData={balanceData['Net earning']} collapse />}
          {balanceData['Total'] && <ListItem key={'Total'} listData={balanceData['Total']} collapse />}
        </>
      )
    }
    return (
      <FusePageSimple
        classes={{
          toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex flex-1 items-center">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <div className="flex flex-1 hidden sm:flex">
                    <Typography variant="h6" className="hidden sm:flex">{'Profit & Loss'}</Typography>
                    <div className="print-export-buttons">
                      <IconButton className="h-32 w-32" onClick={this.ExportPdf}>
                        <Icon>print</Icon>
                      </IconButton>
                      <ReactExport.ExcelFile element={<IconButton className="h-32 w-32">
                        <Icon>table_chart</Icon>
                      </IconButton>
                      }>
                        <ReactExport.ExcelFile.ExcelSheet data={PrintService.excelBalanceData(balanceData)} name="Employees">
                          <ReactExport.ExcelFile.ExcelColumn label="Title" value="title" />
                          <ReactExport.ExcelFile.ExcelColumn label="Debit" value="debit" />
                          <ReactExport.ExcelFile.ExcelColumn label="Credit" value="credit" />
                        </ReactExport.ExcelFile.ExcelSheet>
                      </ReactExport.ExcelFile>
                    </div>
                  </div>

                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-12 sm:p-16">
            <Paper className={`${classes.root} mb-12`} style={{ padding: '1em' }}>
              {showFilter &&
                <Grid container>
                  <Grid item xs={3} md={2}>
                    <CustomSelect
                      label='Type'
                      value={type || ''}
                      onChange={this.changeType}
                    >
                      {trialBallTypes.map((element) => (
                        <MenuItem value={element} key={element}>{element}</MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={3} md={2}>
                    <CustomSelect
                      label='Date'
                      value={dateType || ''}
                      onChange={this.changeDate}
                    >
                      {dateTypes.map((element, index) => (
                        <MenuItem value={element} key={index}>{element}</MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    {filter.datewise.from !== '' &&
                      <CustomTextField
                        label="From"
                        type="date"
                        value={filter.datewise.from === undefined ? '' : filter.datewise.from.format('YYYY-MM-DD')}
                        onChange={this.changeDateRange('from')}
                      />
                    }
                  </Grid>
                  <Grid item xs={3} md={2}>
                    {filter.datewise.to !== '' &&
                      <CustomTextField
                        label="From"
                        type="date"
                        value={filter.datewise.to === undefined ? '' : filter.datewise.to.format('YYYY-MM-DD')}
                        onChange={this.changeDateRange('to')}
                      />
                    }
                  </Grid>
                  <Grid item xs={3} md={2}>
                    <CustomSelect
                      label="Select Project"
                      value={this.state.project || ''}
                      onChange={this.handleChangeProject}
                    >
                      <MenuItem value="-all-project">All projects</MenuItem>
                      {this.state.projects.map((element) => (
                        <MenuItem value={element.id} key={element.id}>{element.project_name}</MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={3} md={2}>
                    <CustomSelect
                      label="Select Branch"
                      value={this.state.branch || ''}
                      onChange={this.handleChangeBranch}
                    >
                      <MenuItem value="-all-branches">All branches</MenuItem>
                      {this.state.branches && this.state.branches.map((element) => (
                        <MenuItem value={element.branch_Id} key={element.branch_Id}>{element.branch_Name}</MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                </Grid>}
              <Grid container justify="flex-end">
                {showFilter
                  ? <Button className='text-transform-none' onClick={this.getBalanceData}>View</Button>
                  : <Button className='text-transform-none' onClick={this.showFilter}>Filter</Button>
                }


              </Grid>
            </Paper>
            <Paper className="trial-balance" style={{ padding: '1em' }}>
              {renderBalance()}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(TrialBalance));