import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import LabelControl from '../LabelControl'

export default class CustomTextField extends Component {
  render() {
    return (
      <LabelControl label={!!this.props.label ? this.props.label : ''}>
        <TextField
          fullWidth
          className='no-padding-input'
          variant='outlined'
          type={this.props.type || ''}
          value={this.props.value || ''}
          error={!!this.props.validation && !this.props.validation(this.props.value)}
          onChange={this.props.onChange}
        />
      </LabelControl>
    )
  }
}
