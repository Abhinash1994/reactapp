import React, { Component } from 'react'
import moment from 'moment';
import {
  Dialog, DialogContent, DialogActions, Button, Checkbox,
  FormControl, FormControlLabel, FormLabel, RadioGroup, Radio
} from '@material-ui/core'
import PropTypes from 'prop-types';
import utils from '../../helper/utils';
import CustomTextField from '../../components/CustomTextField';
class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mastGroup: ['Assets', 'Liabities', 'Income', 'Expenses'],
      filter: this.props.filter,
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
        group_name: '',
        types: []
      }
    })
  }
  render() {
    let { eventType, filter, mastGroup } = this.state;
    return (
      <Dialog
        className='chartodaccount-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <CustomTextField
            label='Group Name'
            value={filter.item_id || ''}
            onChange={this.handleChange('item_id')} />
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
            {mastGroup.map((element, index) => (
              <div className='event' key={index}>
                <FormControlLabel value="all" label={element}
                  control={<Checkbox checked={filter.types.includes(index * 100)}
                    onClick={this.changeEvents(index * 100)} />}
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