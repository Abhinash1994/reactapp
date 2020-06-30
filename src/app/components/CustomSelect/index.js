import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import LabelControl from '../LabelControl'

export default class CustomSelect extends Component {
  render() {
    return (
      <LabelControl label={!!this.props.label ? this.props.label : ''}>
        <TextField
          fullWidth select
          className='no-padding-select'
          variant='outlined'
          value={this.props.value || ''}
          error={!!this.props.validation && !this.props.validation(this.props.value)}
          onChange={this.props.onChange}
        >
          {this.props.children}
        </TextField>
      </LabelControl>
    )
  }
}
