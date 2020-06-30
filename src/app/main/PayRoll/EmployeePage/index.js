import React, { Component } from 'react'
import {
  ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, MenuItem,
  Table, TableBody, TableCell, TableRow, TableHead, IconButton, Icon
} from '@material-ui/core'
import {
  ExpandMore
} from '@material-ui/icons'
//Custom import
import {
  CustomDate, CustomSelect, CustomTextField
} from '../../../components/'
import Variables from '../../../../variables';
import Validations from '../../../helper/Validations';
import BankService from '../../../services/BankService';


const salaryTable = [
  { id: 's.n', numeric: false, disablePadding: true, label: '#', width: '10px' },
  { id: 'salaryHead', numeric: false, disablePadding: true, label: 'Salary Head' },
  { id: 'amount', numeric: false, disablePadding: true, label: 'Amount', width: '150px' },
];

const attachTable = [
  { id: 's.n', numeric: false, disablePadding: true, label: '#', width: '10px' },
  { id: 'filename', numeric: false, disablePadding: true, label: 'File Name' },
  { id: 'actions', numeric: false, disablePadding: true, label: '' },
];

export default class EmployeePage extends Component {
  state = {
    employee: {
      emp_no: '',
      gender: '',
      fname: '',
      lname: '',
      tadd: '',
      padd: '',
      mob: '',
      email: '',
      gcontact: '',
      dob: '',
      married: '',

      depart: '',
      designation: '',
      dateofjoin: '',
      dateofleave: '',

      bank_name: 0,
      accno: 0,
      payment_type: 0
    },
    banks: [],
    salaries: [],
    attachments: []
  }
  async componentDidMount() {
    let banks = await BankService.getBanks();
    this.setState({ banks });
  }
  handleEmpChange = name => event => {
    let { employee } = this.state;
    switch (name) {
      default:
        employee[name] = event.target.value
    }
    this.setState({ employee });
  }
  onFileRemove = (row) => {

  }
  renderPersonInfo = (employee) => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>Personal Infomation</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={6}>
            <CustomTextField
              label='Employee No.'
              value={employee.emp_no} />
          </Grid>
          <Grid item xs={6}>
            <CustomSelect
              label='Employee No.'
              value={employee.gender}
              validation={Validations.isEmpty}
              onChange={this.handleEmpChange('gender')}>
              {Variables.gender.map((element) => (
                <MenuItem key={element} value={element}>{element}</MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='First Name'
              validation={Validations.isEmpty}
              value={employee.fname}
              onChange={this.handleEmpChange('fname')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Last Name'
              validation={Validations.isEmpty}
              value={employee.lname}
              onChange={this.handleEmpChange('lname')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Temporary Adress'
              validation={Validations.isEmpty}
              value={employee.tadd}
              onChange={this.handleEmpChange('tadd')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Permanent Adress'
              validation={Validations.isEmpty}
              value={employee.padd}
              onChange={this.handleEmpChange('padd')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Mobile'
              validation={Validations.TelephoneValidation}
              value={employee.mob}
              onChange={this.handleEmpChange('mob')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Email'
              validation={Validations.EmailValidation}
              value={employee.email}
              onChange={this.handleEmpChange('email')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Guardian Contact'
              validation={Validations.isEmpty}
              value={employee.gcontact}
              onChange={this.handleEmpChange('gcontact')} />
          </Grid>
          <Grid item xs={6}>
            <CustomDate
              label='Date of Birth'
              value={employee.dob}
              onChange={this.handleEmpChange('dob')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Marital Status'
              value={employee.married}
              validation={Validations.IntegerValidation}
              onChange={this.handleEmpChange('married')} />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Card No.'
              validation={Validations.IntegerValidation}
              value={employee.card_no}
              onChange={this.handleEmpChange('card_no')} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
  renderOfficalInfo = employee => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>Official Information</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={4}>
            <CustomTextField
              label='Department'
              validation={Validations.isEmpty}
              value={employee.depart}
              onChange={this.handleEmpChange('depart')} />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              label='Designation'
              validation={Validations.isEmpty}
              value={employee.designation}
              onChange={this.handleEmpChange('designation')} />
          </Grid>
          <Grid item xs={4}>
            <CustomDate
              label='Date of join'
              value={employee.dateofjoin}
              onChange={this.handleEmpChange('dateofjoin')} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
  renderPaymentInfo = (employee, banks) => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>Payment Information</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={6}>
            <CustomSelect
              label='Bank Name'
              validation={Validations.IntegerValidation}
              value={employee.bank_name}
              onChange={this.handleEmpChange('bank_name')} >
              {banks.map(bank => (
                <MenuItem key={bank.id} value={bank.id}>{bank.name}</MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Bank Name'
              validation={Validations.IntegerValidation}
              value={employee.bank_name}
              onChange={this.handleEmpChange('bank_name')} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  renderSalaryInfo = salaries => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>Salary Information</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table>
          <TableHead>
            {salaryTable.map(row => (
              <TableCell
                className='header-th'
                key={row.id}
                align="left"
                style={row.width ? { width: row.width } : {}}
              >
                {row.label}
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {salaries.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align='left'>{index + 1}</TableCell>
                <TableCell align='left'>{row.salaryHead}</TableCell>
                <TableCell align='left'>{row.amount}</TableCell>
              </TableRow>
            ))}
            {salaries.length === 0 &&
              <TableRow>
                <TableCell align='left' colSpan={3}>
                  {'No Salary found.'}
                </TableCell>
              </TableRow>}
            <TableRow>
              <TableCell align='right' colSpan={2}>Total</TableCell>
              <TableCell align='left'>0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
  renderAttachmentInfo = attachments => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>Salary Information</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table>
          <TableHead>
            {attachTable.map(row => (
              <TableCell
                className='header-th'
                key={row.id}
                align="left"
                style={row.width ? { width: row.width } : {}}
              >
                {row.label}
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {attachments.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align='left'>{index + 1}</TableCell>
                <TableCell align='left'>{row.filename}</TableCell>
                <TableCell align='left'>
                  <IconButton onClick={(ev) => {
                    if (window.confirm('Are you sure to remove this file?')) {
                      this.onFileRemove(row);
                    }
                  }}
                    className='color-brown'>
                    <Icon type="small">delete</Icon>
                  </IconButton>}
                </TableCell>
              </TableRow>
            ))}
            {attachments.length === 0 &&
              <TableRow>
                <TableCell align='left' colSpan={3}>
                  {'No File found.'}
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
  render() {
    const { employee, banks, salaries, attachments } = this.state;
    return (
      <Grid container>
        <Grid item xs={12} sm={6} className='employee-info-page'>
          {this.renderPersonInfo(employee)}
        </Grid>
        <Grid item xs={12} sm={6} className='employee-info-page'>
          <Grid container>
            <Grid item xs={12}>
              {this.renderOfficalInfo(employee)}
            </Grid>
            <Grid item xs={12}>
              {this.renderPaymentInfo(employee, banks)}
            </Grid>
            <Grid item xs={12}>
              {this.renderSalaryInfo(salaries)}
            </Grid>
            <Grid item xs={12}>
              {this.renderAttachmentInfo(attachments)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
