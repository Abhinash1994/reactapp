import React, { Component } from 'react'
import {
  Dialog, DialogContent, TextField, MenuItem, DialogActions,
  FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, Checkbox
} from '@material-ui/core'
import moment from 'moment'
import PropTypes from 'prop-types';
import { Button } from 'antd';
import LabelControl from '../../components/LabelControl';
class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: this.props.filter,
      dateType: 'All dates',
      eventType: 'all',
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
      events: [
        'login',
        'signup',
        'create',
        'delete',
        'update',
        'read'
      ]
    }
  }

  changeDateRange = name => event => {
    this.setState({
      dateType: 'Custom',
      filter: {
        ...this.state.filter,
        [name]: moment(event.target.value)
      }
    });
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
  changeDate = (event) => {
    let from, to, now;
    now = moment();
    switch (event.target.value) {
      case 'All dates':
        from = to = '';
        break;
      case 'Custom':
        from = moment(now.format('YYYY-MM-DD'));
        to = moment(now.format('YYYY-MM-DD')).add(1, 'days');
        break;
      case 'Today':
        from = moment(now.format('YYYY-MM-DD'));
        to = moment(now.format('YYYY-MM-DD')).add(1, 'days');
        break;
      case 'Yesterday':
        from = moment(now.format('YYYY-MM-DD')).add(-1, 'days');
        to = moment(now.format('YYYY-MM-DD'));
        break;
      case 'This week':
        from = moment(now.format('YYYY-MM-DD')).set({ day: 0 });
        to = moment(now.format('YYYY-MM-DD')).set({ day: 6 });
        break;
      case 'This month':
        from = moment(now.format('YYYY-MM-DD')).set({ date: 1 });
        to = moment(now.format('YYYY-MM-DD')).add(1, 'months').date(0);
        break;
      case 'This year':
        from = moment(now.format('YYYY-MM-DD')).set({ month: 0, date: 1 });
        to = moment(now.format('YYYY-MM-DD')).set({ month: 11, date: 31 });
        break;
      case 'Last week':
        from = moment(now.format('YYYY-MM-DD')).set({ day: 0 }).add(-7, 'days');
        to = moment(now.format('YYYY-MM-DD')).set({ day: 6 }).add(-7, 'days');
        break;
      case 'Last month':
        from = moment(now.format('YYYY-MM-DD')).add(-1, 'months').set({ date: 1 });
        to = moment(now.format('YYYY-MM-DD')).date(0);
        break;
      case 'Last year':
        from = moment(now.format('YYYY-MM-DD')).add(-1, 'years').set({ month: 0, date: 1 });
        to = moment(now.format('YYYY-MM-DD')).add(-1, 'years').set({ month: 11, date: 31 });
        break;
      default:
        from = moment(now.format('YYYY-MM-DD'));
        to = moment(now.format('YYYY-MM-DD')).add(1, 'days');

    }
    this.setState({ dateType: event.target.value, filter: { ...this.state.filter, from, to } })
  }
  changeEvents = name => event => {
    let types = this.state.filter.types
    if (event.target.checked) {
      types.push(name);
    } else {
      types.splice(types.indexOf(name), 1);
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
  render() {
    let { filter, dateType, dateTypes, events, eventType } = this.state;
    return (
      <Dialog
        className='user-log-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <div className='list-user'>
            <LabelControl label='Users'>
              <TextField
                select fullWidth
                variant='outlined'
                value={filter.user || ''}
                onChange={this.handleChange('user')}
              >
                <MenuItem value='all'>All Users</MenuItem>
                <MenuItem value='currentUser'>Current Users</MenuItem>
              </TextField>
            </LabelControl>
          </div>
          <div className='list-date'>
            <LabelControl label='Date'>
              <TextField
                select
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
            {moment.isMoment(filter.from) && <LabelControl label='From'>
              <TextField
                type='date'
                variant='outlined'
                value={moment.isMoment(filter.from) ? filter.from.format('YYYY-MM-DD') : ''}
                onChange={this.changeDateRange('from')}
              />
            </LabelControl>}
            {moment.isMoment(filter.to) && <LabelControl label='To'>
              <TextField
                type='date'
                variant='outlined'
                value={moment.isMoment(filter.to) ? filter.to.format('YYYY-MM-DD') : ''}
                onChange={this.changeDateRange('to')}
              />
            </LabelControl>
            }
          </div>
          <div className='show-event'>
            <FormControl component="fieldset">
              <FormLabel component="div" className='title'>Event</FormLabel>
              <RadioGroup value={eventType} onChange={this.handleChangeEvent}>
                <FormControlLabel value="all" control={<Radio />} label="Show all events" />
                <FormControlLabel value="selected" control={<Radio />} label="Show only these events" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='event-content'>
            {events.map((element, index) => (
              <div className='event' key={index}>
                <FormControlLabel value="all" label={element}
                  control={<Checkbox checked={filter.types.includes(element)}
                    onClick={this.changeEvents(element)} />}
                />
              </div>
            ))}

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.changeFilter}>Filter</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  changeFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired
}
export default FilterDialog;