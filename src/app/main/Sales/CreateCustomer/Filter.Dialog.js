import React, { Component } from 'react'
import {
  Dialog, DialogContent, DialogActions, Button,
  FormControl, FormLabel, Radio, RadioGroup, FormControlLabel
} from '@material-ui/core'
import PropTypes from 'prop-types';
class FilterDialog extends Component {
  // state = {
  //   filter: {}
  // }

  constructor(props) {
    super(props);
    this.state = {
      filter: this.props.filter,
      eventType: 'all'
    }
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
  render() {
    let { eventType } = this.state;
    return (
      <Dialog
        className='product-type-filter-dialog'
        fullWidth
        open={this.props.open} onClose={this.props.onClose}>
        <DialogContent className='content'>
          <div className='show-type'>
            <FormControl component="fieldset">
              <FormLabel component="div" className='title'>Product Type</FormLabel>
              <RadioGroup value={eventType} onChange={this.handleChangeEvent}>
                <FormControlLabel value="all" control={<Radio />} label="Show all events" />
                <FormControlLabel value="selected" control={<Radio />} label="Show only these events" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='type-content'>
            {/* {productTypes.map((element, index) => (
              <div className='type' key={index}>
                <FormControlLabel value="all" label={element.type}
                  control={<Checkbox checked={filter.types.includes(element.id)}
                    onClick={this.changeEvents(element.id)} />}
                />
              </div>
            ))} */}

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