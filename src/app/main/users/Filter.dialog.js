import React, { Component } from 'react'
import {
  Dialog, DialogContent, TextField, MenuItem, DialogActions, Chip, Button,
  FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, Checkbox,
  Input, InputLabel, Select
} from '@material-ui/core'
import moment from 'moment'
import PropTypes from 'prop-types';
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
      ],
      branchName: []
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.open)
  //     this.setState({ filter: nextProps.filter })
  // }

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
  handleChangeBranch = event => {
    this.setState({
      branchName: event.target.value
    })
  }
  changeFilter = () => {
    this.props.changeFilter(this.state.filter);
  }
  resetFilter = () => {
    this.setState({
      dateType: 'All dates',
      eventType: 'all',
      filter: {
        name_email: '',
        roles: [],
        createFrom: '',
        createTo: '',
        branchs: []
      }
    });
    this.props.changeFilter({
      name_email: '',
      roles: [],
      createFrom: '',
      createTo: '',
      branchs: []
    });
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
    this.setState({
      dateType: event.target.value,
      filter: {
        ...this.state.filter,
        createFrom: from,
        createTo: to
      }
    })
  }
  changeRoles = name => event => {
    let roles = this.state.filter.roles;
    if (!Array.isArray(roles)) {
      roles = [];
    }
    if (event.target.checked) {
      roles.push(name);
    } else {
      roles.splice(roles.indexOf(name), 1);
    }
    this.setState({
      eventType: 'selected',
      filter: { ...this.state.filter, roles }
    })
  }
  handleChangeEvent = event => {
    if (event.target.value === 'all') {
      this.setState({
        eventType: event.target.value,
        filter: {
          ...this.state.filter,
          roles: []
        }
      });
    } else {
      this.setState({ eventType: event.target.value });
    }

  }
  handleDelete = value => {
    let branchs = this.state.filter.branchs;
    branchs.splice(branchs.indexOf(value), 1);
    this.setState({
      filter: {
        ...this.state.filter,
        branchs
      }
    })
  }
  render() {
    let { filter, dateType, dateTypes, eventType } = this.state;
    return (
      <Dialog
        className='user-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <div className='list-user'>
            <TextField
              fullWidth
              variant='outlined'
              value={filter.user_email || ''}
              label='Users & Email'
              onChange={this.handleChange('user_email')}
            />
          </div>
          <div className='list-date'>
            <TextField
              select
              variant='outlined'
              label='Created Date'
              style={{ width: '150px' }}
              value={dateType || ''}
              onChange={this.changeDate}
            >
              {dateTypes.map((element, index) => (
                <MenuItem value={element} key={index}>{element}</MenuItem>
              ))}
            </TextField>
            {dateType !== 'All dates' &&
              <>
                <TextField
                  type='date'
                  label='From'
                  variant='outlined'
                  value={moment.isMoment(filter.createFrom) ? filter.createFrom.format('YYYY-MM-DD') : ''}
                  onChange={this.changeDateRange('createFrom')}
                />
                <TextField
                  type='date'
                  label='To'
                  variant='outlined'
                  value={moment.isMoment(filter.createTo) ? filter.createTo.format('YYYY-MM-DD') : ''}
                  onChange={this.changeDateRange('createTo')}
                />
              </>}
          </div>
          <div className='show-event'>
            <FormControl component="fieldset">
              <FormLabel component="div" className='title'>Roles</FormLabel>
              <RadioGroup value={eventType} onChange={this.handleChangeEvent}>
                <FormControlLabel value="all" control={<Radio />} label="Show all roles" />
                <FormControlLabel value="selected" control={<Radio />} label="Show only these roles" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='event-content'>
            {this.props.roles.map(element => (
              <div className='event' key={element.roll_Id}>
                <FormControlLabel value="all" label={element.rollname}
                  control={<Checkbox
                    checked={filter.roles.includes(element.roll_Id)}
                    onClick={this.changeRoles(element.roll_Id)} />}
                />
              </div>
            ))}
          </div>
          <div className='branch-content'>
            <FormControl className='branch-select' variant='outlined'>
              <InputLabel id="demo-mutiple-chip-label">Branch</InputLabel>
              <Select
                labelid="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                variant='outlined'
                multiple fullWidth
                value={filter.branchs}
                onChange={this.handleChange('branchs')}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div>
                    {selected.map(value => (
                      <Chip key={value}
                        variant="outlined"
                        label={this.props.branchsMap[value].branch_Name}
                        onDelete={() => this.handleDelete(value)}
                      />
                    ))}
                  </div>
                )}
              >
                {this.props.branchs.map(branch => (
                  <MenuItem key={branch.branch_Id} value={branch.branch_Id}>
                    {branch.branch_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.resetFilter}>Reset</Button>
          <Button onClick={this.changeFilter}>Filter</Button>
          {/* <Button onClick={this.props.onClose}>Cancel</Button> */}
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