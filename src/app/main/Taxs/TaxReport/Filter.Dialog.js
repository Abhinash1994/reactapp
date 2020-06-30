import React, { Component } from 'react'
import moment from 'moment';
import {
  Dialog, DialogContent, DialogActions, TextField, MenuItem, Button
} from '@material-ui/core'
import PropTypes from 'prop-types';
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
      ledgers: [],
      eventType: 'all',
      status: [
        { value: 0, label: 'Open' },
        { value: 1, label: 'Paid' },
        { value: 2, label: 'OverDue' },
      ]
    }
  }

  async componentDidMount() {
   
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
        ledger: 0,
        datewise: {},
        types: []
      }
    })
  }
  render() {
    let { filter, dateType, dateTypes } = this.state;
    return (
      <Dialog
        className='tax-report-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <LabelControl label='Ledger'>
            <TextField select fullWidth
              className='no-padding-select'
              variant='outlined'
              value={filter.name || ''}
              onChange={this.handleChange('name')}>
              <MenuItem key={-1} value={-1}>Show all products</MenuItem>
              {this.props.ledgers && 
              this.props.ledgers.map((element, index) => (
                <MenuItem key={index} value={element.name}>{element.name}</MenuItem>
              ))}
            </TextField>
          </LabelControl>
          <div className='list-date'>
            <LabelControl label='Date'>
              <TextField
                select
                className='no-padding-input'
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
                  className='no-padding-input'
                  type='date'
                  variant='outlined'
                  value={filter.datewise.to.format('YYYY-MM-DD') || ''}
                  onChange={this.changeDateRange('to')}
                />
              </LabelControl>}
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