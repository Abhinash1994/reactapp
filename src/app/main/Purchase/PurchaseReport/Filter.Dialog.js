import React, { Component } from 'react'
import moment from 'moment';
import {
  Dialog, DialogContent, DialogActions, TextField, MenuItem,Button
} from '@material-ui/core'
import PropTypes from 'prop-types';
import utils from '../../../helper/utils';
import ProductService from '../../../services/ProductService';
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
      products: [],
      eventType: 'all',
      status: [
        { value: 0, label: 'Open' },
        { value: 1, label: 'Paid' },
        { value: 2, label: 'OverDue' },
      ]
    }
  }

  async componentDidMount() {
    const products = await ProductService.getProductServices();
    this.setState({ products });
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
        item_id: -1,
        min: 0,
        max: 0,
        datewise: {},
        types: []
      }
    })
  }
  render() {
    let { filter, dateType, dateTypes, products } = this.state;
    return (
      <Dialog
        className='invoice-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <LabelControl label='Customer'>
            <TextField select fullWidth
              variant='outlined'
              value={filter.item_id || ''}
              onChange={this.handleChange('item_id')}>
              <MenuItem key={-1} value={-1}>Show all products</MenuItem>
              {products.map((element, index) => (
                <MenuItem key={index} value={element.id}>{element.p_name}</MenuItem>
              ))}
            </TextField>
          </LabelControl>
          <div className='list-date mt-16'>
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
            {moment.isMoment(filter.datewise.from) &&
              <LabelControl label='From'>
                <TextField
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
                  value={filter.datewise.to.format('YYYY-MM-DD') || ''}
                  onChange={this.changeDateRange('to')}
                />
              </LabelControl>}
          </div>
          <div className='list-date mt-16'>
            <LabelControl label='Min Amount'>
              <TextField
                variant='outlined'
                value={filter.min || ''}
                onChange={this.handleChange('min')}
              />
            </LabelControl>
            <LabelControl label='Max Amount'>
              <TextField
                variant='outlined'
                value={filter.max || ''}
                onChange={this.handleChange('max')}
              />
            </LabelControl>
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