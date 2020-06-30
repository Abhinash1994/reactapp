import React, { Component } from 'react';
import {
  Typography, Button, Checkbox, MenuItem,
  Table, TableBody, TableCell, TableRow, Paper, Grid, TableHead,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import { ExpandMore, Sms } from '@material-ui/icons';
import {
  CustomSelect, CustomTextarea
} from '../../../components';
import Validations from '../../../helper/Validations'
import { CustomerService, SupplierService } from '../../../services';

class SendSms extends Component {

  state = {
    rows: [],
    selected: [],
    values: {
      group: 'Customer',
      message: ''
    },
    groups: ['All', 'Customer', 'Supplier', 'Staff']
  };

  async componentDidMount() {
    const rows = await CustomerService.getCustomerServices();
    this.setState({ rows });
  }

  handleValuesChange = name => async event => {
    let rows = [];
    if (name === 'group') {
      switch (event.target.value) {
        case 'Customer':
          rows = await CustomerService.getCustomerServices();
          break;
        case 'Supplier':
          rows = await SupplierService.getSuppliers();
          break;
        case 'Staff':
          rows = await SupplierService.getSuppliers();
          break;
        default:
          let customer = await CustomerService.getCustomerServices();
          let supplier = await SupplierService.getSuppliers();
          rows = rows.concat(customer, supplier);
          break;
      }

    } else {
      rows = this.state.rows
    }
    this.setState({
      values: {
        ...this.state.values,
        [name]: event.target.value
      },
      rows
    })
  }

  handleRowsChange = id => {
    let { selected } = this.state;
    if (selected.includes(id)) {
      selected.splice(selected.indexOf(id), 1);
    } else {
      selected.push(id);
    }
    this.setState({ selected });
  }
  checkSelect = () => {
    for (let i = 0; i < this.state.rows.length; i++) {
      if (this.state.rows[i].selected) {
        return true;
      }
    }
    return false;
  }

  checkAll = event => {
    let selected = [];
    if (event.target.checked) {
      this.state.rows.forEach(row => {
        selected.push(row.cust_id);
      })
    }
    this.setState({ selected });
  }

  renderSelectUser = (selected, rows, values) => (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        className='panel-header'
        expandIcon={<ExpandMore />}
      >
        <Typography>{`${selected.length} user${selected.length > 1 ? 's' : ''} selected.`}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '10px' }}>
                <Checkbox
                  indeterminate={selected.length !== rows.length}
                  checked={!!selected.length}
                  onChange={this.checkAll} />
              </TableCell>
              <TableCell>
                {values.group === 'all' ? `${values.group} Name` : 'Name'}
              </TableCell>
              <TableCell>{'Mobile'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox checked={selected.includes(row.cust_id)} onChange={() => this.handleRowsChange(row.cust_id)} />
                </TableCell>
                <TableCell>{row.cust_name}</TableCell>
                <TableCell>{row.mob}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </ExpansionPanelDetails>
    </ExpansionPanel>
  )

  render() {
    const { values, groups, rows, selected } = this.state;
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
                  <Sms className="text-32 mr-12" />
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="hidden sm:flex">{'Send SMS'}</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={
          <div className="p-16 sm:p-24">
            <Paper style={{ padding: '1em' }}>
              <Grid container>
                <Grid item xs={12}>
                  <CustomSelect label='Choose Group'
                    value={values.group}
                    validation={Validations.isEmpty}
                    onChange={this.handleValuesChange('group')}>
                    {groups.map(element => (
                      <MenuItem key={element} value={element}>{element}</MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12}>
                  {this.renderSelectUser(selected, rows, values)}
                </Grid>
                <Grid item xs={12}>
                  <CustomTextarea label='Message'
                    validation={Validations.isEmpty}
                    rows={5}
                    value={values.message}
                    onChange={this.handleValuesChange('message')} />
                </Grid>
                <Grid item xs={12} className='flex justify-end'>
                  <Button variant='contained' color='primary' className='text-transform-none'>Send Message</Button>
                </Grid>
              </Grid>
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
export default connect(mapStateToProps, mapDispatchToProps)(SendSms);
