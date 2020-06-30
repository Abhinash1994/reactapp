import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import LabelControl from '../LabelControl'
import moment from 'moment'

export default class CustomDate extends Component {
  render() {
    return (
      <LabelControl label={!!this.props.label ? this.props.label : ''}>
        <TextField
          fullWidth
          type='date'
          className='no-padding-input'
          variant='outlined'
          value={this.props.value || ''}
          error={!moment(this.props.value).isValid()}
          onChange={this.props.onChange}
        >
          {this.props.children}
        </TextField>
      </LabelControl>
    )
  }
}
