import React, { Component } from 'react'
import moment from 'moment';
import {
  Dialog, DialogContent, DialogActions, Checkbox, TextField, MenuItem,
  Radio, RadioGroup, FormControlLabel, Button
} from '@material-ui/core'
import PropTypes from 'prop-types';
import CustomerService from '../../../services/CustomerService';
import utils from '../../../helper/utils';
import LabelControl from '../../../components/LabelControl';
class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTypes: [
        'All dates',
        'Custom',
        'Today',
        'Yesterday',
        'This week',
        'This month',
        'This year',
        'Last week',
        'Last month',
        'Last year'
      ],
      dateType: 'All dates',
      filter: this.props.filter,
      customers: props.customers,
      eventType: 'all',
      status: [
        { value: 0, label: 'Open' },
        { value: 1, label: 'Paid' },
        { value: 2, label: 'OverDue' },
      ]
    }
  }

  async componentDidMount() {
    const customers = await CustomerService.getCustomerServices();
    this.setState({ customers });
  }

  handleChange = name => event => {
    if (event.target.checked) {
      this.setState({
        filter: {
          ...this.state.filter,
          [name]: event.target.checked
        }
      });
    } else {
      this.setState({ filter: { ...this.state.filter, [name]: event.target.value } })
    }
  }
  changeFilter = () => {
    this.props.changeFilter(this.state.filter);
  }

  changeEvents = element => event => {
    let types = this.state.filter.types
    if (event.target.checked) {
      types.push(element);
    } else {
      types.splice(types.indexOf(element), 1);
    }
    this.setState({
      eventType: 'selected',
      filter: { ...this.state.filter, types }
    })
  }
  handleChangeEvent = event => {
    if (event.target.value === 'all') {
      this.setState({
        eventType: event.target.value,
        filter: {
          ...this.state.filter,
          types: []
        }
      });
    } else {
      this.setState({ eventType: event.target.value });
    }

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
  reset = () => {
    this.setState({
      dateType: 'All dates',
      filter: {
        cust_id: -1,
        min: 0,
        max: 0,
        datewise: {},
        types: []
      }
    })
  }
  render() {
    let { eventType, status, filter, dateType, dateTypes, customers } = this.state;
    return (
      <Dialog
        className='invoice-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <LabelControl label='Customer'>
            <TextField select fullWidth
              className='no-padding-select'
              variant='outlined'
              value={filter.cust_id || ''}
              onChange={this.handleChange('cust_id')}>
              <MenuItem key={-1} value={-1}>Show all customers</MenuItem>
              {customers.map((element, index) => (
                <MenuItem key={index} value={element.cust_id}>{element.cust_name}</MenuItem>
              ))}
            </TextField>
          </LabelControl>
          <div className='list-date mt-16'>
            <LabelControl label='Date'>
              <TextField
                select
                className='no-padding-select'
                variant='outlined'
                style={{ width: '150px' }}
                value={dateType || ''}
                onChange={this.changeDate}
              >
                {dateTypes.map((element, index) => (
                  <MenuItem value={element} key={index}>{element}</MenuItem>
                ))}
              </TextField>
            </LabelControl>
            {moment.isMoment(filter.datewise.from) &&
              <LabelControl label='From'>
                <TextField
                  className='no-padding-input'
                  type='date'
                  variant='outlined'
                  value={filter.datewise.from.format('YYYY-MM-DD') || ''}
                  onChange={this.changeDateRange('from')}
                />
              </LabelControl>}
            {moment.isMoment(filter.datewise.to) &&
              <LabelControl label='To'>
                <TextField
                  type='date'
                  variant='outlined'
                  className='no-padding-input'
                  value={filter.datewise.to.format('YYYY-MM-DD') || ''}
                  onChange={this.changeDateRange('to')}
                />
              </LabelControl>}
          </div>
          <div className='list-date'>
            <LabelControl label='Min Amount'>
              <TextField
                className='no-padding-input'
                variant='outlined'
                value={filter.min || ''}
                onChange={this.handleChange('min')}
              />
            </LabelControl>
            <LabelControl label='Max Amount'>
              <TextField
                className='no-padding-input'
                variant='outlined'
                value={filter.max || ''}
                onChange={this.handleChange('max')}
              />
            </LabelControl>
          </div>
          <div className='show-type mt-16'>
            <LabelControl label='Status'>
              <RadioGroup value={eventType} onChange={this.handleChangeEvent}>
                <FormControlLabel value="all" control={<Radio />} label="Show all status" />
                <FormControlLabel value="selected" control={<Radio />} label="Show only these status" />
              </RadioGroup>
            </LabelControl>
          </div>
          <div className='type-content'>
            {status.map((element, index) => (
              <div className='type' key={index}>
                <FormControlLabel value="all" label={element.label}
                  control={<Checkbox checked={filter.types.includes(element.value)}
                    onClick={this.changeEvents(element.value)} />}
                />
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.changeFilter}>Filter</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button onClick={this.reset}>Reset</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  changeFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
}
export default FilterDialog;