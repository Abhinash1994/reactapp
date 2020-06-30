import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Table, TableBody, TableCell, TableRow, Paper, Grid, MenuItem, TableHead
} from '@material-ui/core';
import * as authActions from 'app/auth/store/actions';
import utils from '../../../helper/utils'
import { NotificationManager } from 'react-notifications';
import { CustomTextField, CustomSelect, EditRowText } from '../../../components';
import Validations from '../../../helper/Validations'
import varients from '../../../../variables'
import { FiscalService, ChartOfAccountService, BudgetService, BudgetDetailService } from '../../../services';
const intervals = [
  { label: 'Monthly', value: 1 },
  { label: 'Quarterly', value: 2 },
  { label: 'Yearly', value: 3 }
];
const tableHeaders = [
  ['Account'],
  ['Account', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SET', 'OCT', 'NOV', 'DEC', 'TOTAL'],
  ['Account', 'JAN-MAR', 'APR-JUN', 'JUL-SEP', 'OCT-DEC', 'TOTAL'],
  ['Account', 'JAN-DEC'],
]
class EditBudget extends Component {

  state = {
    editRow: 0,
    rows: [],
    tableHeader: [],
    changed: false,
    fiscalYears: [],
    chartofaccs: [],
    chartofaccObjects: {},
    budget: {
      name: '',
      fiscalYear: 0,
      interval: 0
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    const fiscalYears = await FiscalService.getAllFiscal();
    const chartofaccs = await ChartOfAccountService.getChartOfAccounts();
    let chartofaccObjects = {};
    chartofaccs.forEach(element => {
      chartofaccObjects[element.id] = element;
    })
    this.setState({ fiscalYears, chartofaccs, chartofaccObjects });
    if (this.props.editId) {
      const budget = await BudgetService.getBudget(this.props.editId);
      if (budget) {
        this.setState({ budget });
        this.readDetail();
      }
    }
  }

  readDetail = async (id = this.state.budget.id) => {
    const details = await BudgetDetailService.getBudgetDetails(id);
    console.log(details);
    // let rows = {};
    // details.forEach(element=>{
    //   rows.push({
    //     id:element.id,

    //   })
    // })
    this.setState({ rows: details });
  }
  handleBudgetChange = name => event => {
    if (name === 'interval') {
      this.makeBaseData(event.target.value);
    }
    this.setState({
      budget: {
        ...this.state.budget,
        [name]: event.target.value
      }
    })
  }
  makeBaseData = (index) => {
    const { chartofaccs } = this.state;
    let rows = [];
    chartofaccs.forEach(element => {
      let row = new Array(tableHeaders[index].length).fill(0);
      row[0] = element.id;
      rows.push({
        values: row
      });
    });
    this.setState({ rows });
  }

  changeRow = (row, cell) => event => {
    let { rows, editRow } = this.state;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === editRow) {
        rows[i].values[cell] = event.target.value;
      }
    }
    this.caculationTable(rows);
  }

  handleSave = async () => {
    if (!!this.state.budget.id) {
      this.state.rows.forEach(async element => {
        await BudgetDetailService.updateBudgetDetail(element);
      });
      NotificationManager.success('Success Updated', 'Budget');
    } else {
      let budget = await BudgetService.createBudget(this.state.budget);
      if (!!budget) {
        this.state.rows.forEach(async element => {
          element.budget = budget.id;
          await BudgetDetailService.createBudgetDetail(element);
        })
        NotificationManager.success('Success add budget', 'Budget');
        this.readDetail(budget.id);
        this.setState({ budget });
      }
    }
  }

  checkBeforeSave = () => {
  }

  handleRemove = async row => {
  }

  changeEditRow = editRow => {
    this.setState({ editRow })
  }
  caculationTable = (rows) => {
    if (this.state.budget.interval !== 3) {
      for (let i = 0; i < rows.length; i++) {
        let total = 0;
        for (let j = 1; j < rows[i].values.length - 1; j++) {
          total += Number(rows[i].values[j]);
        }
        rows[i].values[rows[i].values.length - 1] = total;
      }
    }
    this.setState({ rows });
  }
  print = () => {
  }
  renderBudget = (budget, fiscalYears) => (
    <Paper className='mb-16 p-16' style={{ padding: '1em' }}>
      <Grid container>
        <Grid item xs={12} sm={2}>
          <CustomTextField
            label='Name *'
            validation={Validations.isEmpty}
            value={budget.name}
            onChange={this.handleBudgetChange('name')} />
        </Grid>
        {!budget.id &&
          <React.Fragment>
            <Grid item xs={12} sm={2}>
              <CustomSelect
                label='Fiscal Year'
                validation={Validations.isEmpty}
                value={budget.fiscalYear}
                onChange={this.handleBudgetChange('fiscalYear')}>
                {fiscalYears.map(fiscal => (
                  <MenuItem key={fiscal.fiscal_Id} value={fiscal.fiscal_Id}>
                    {fiscal.fiscalyear}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomSelect
                label='Interval'
                validation={Validations.isEmpty}
                value={budget.interval}
                onChange={this.handleBudgetChange('interval')}>
                {intervals.map(element => (
                  <MenuItem key={element.value} value={element.value}>
                    {element.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
          </React.Fragment>}
      </Grid>
    </Paper>
  );
  renderTable = (budget, keys, result, chartofaccObjects) => (

    <Table>
      <TableHead>
        <TableRow>
          {tableHeaders[budget.interval].map(element => (
            <TableCell key={element} align='left'>{element}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {
          keys.map(element => (
            <React.Fragment>
              <TableRow>
                <TableCell colSpan={tableHeaders[budget.interval].length} className='group-header'>
                  {varients.mastGroup[element].label}
                </TableCell>
              </TableRow>
              {this.renderTableBody(budget, result[element], chartofaccObjects)}
            </React.Fragment>
          ))
        }
      </TableBody>
    </Table>
  );
  renderTableBody = (budget, rows, chartofaccObjects) => (
    <React.Fragment>
      {rows.map((element, index) => (
        ((element.id !== this.state.editRow) || !budget.id)
          ? <TableRow key={index} onClick={() => this.changeEditRow(element.id)} className='pointer'>
            {element.values.map((element, index) => (
              <TableCell key={index}>
                {!!index ? utils.toFixNumber(element) : chartofaccObjects[element].ledger_name}
              </TableCell>
            ))}
          </TableRow>
          : this.renderEditRow(index, element, chartofaccObjects)
      ))}
    </React.Fragment>
  );
  renderEditRow = (key, row, chartofaccObjects) => (
    <TableRow key={key} className='pointer'>
      {row.values.map((element, index) => (
        <TableCell key={index}>
          {!!index
            ? <EditRowText
              value={element}
              onChange={this.changeRow(key, index)}
            />
            : chartofaccObjects[element].ledger_name}
        </TableCell>
      ))}
    </TableRow>
  );
  groupingData = () => {
    let result = {};
    let keys = [];
    for (let key in varients.mastGroup) {
      result[key] = [];
      keys.push(key);
    }
    this.state.rows.forEach(element => {
      result[this.state.chartofaccObjects[element.values[0]].mast_Code].push(element);
    })
    return { keys, result };
  }
  render() {
    const { budget, fiscalYears, chartofaccObjects } = this.state;
    let { keys, result } = this.groupingData();
    return (
      <React.Fragment>
        {this.renderBudget(budget, fiscalYears)}
        <Paper style={{ padding: '1em' }} className='edit-content-part'>
          {this.renderTable(budget, keys, result, chartofaccObjects)}
          <div className='budget-action-part flex justify-end'>
            <Button onClick={this.handleSave} variant='contained' color='primary'>
              {budget.id ? 'Update' : 'Next'}
            </Button>
            {!!budget.id && <Button variant='contained' color='primary' onClick={() => this.handleRemove(budget)}>Delete</Button>}
            {!!budget.id && <Button variant='contained' color='primary' onClick={this.print}>Print</Button>}
            {this.props.editClose && <Button variant='contained' color='primary' onClick={this.props.editClose}>Cancel</Button>}
          </div>
        </Paper>
      </React.Fragment>
    )
  }
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
export default connect(mapStateToProps, mapDispatchToProps)(EditBudget);
