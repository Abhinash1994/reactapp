import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import LabelControl from '../LabelControl'

export default class CustomTextarea extends Component {
  render() {
    return (
      <LabelControl label={!!this.props.label ? this.props.label : ''}>
        <TextField
          fullWidth multiline
          className='no-padding-input'
          variant='outlined'
          rows={!!this.props.rows ? this.props.rows : 5}
          value={this.props.value || ''}
          error={!!this.props.validation && !this.props.validation(this.props.value)}
          onChange={this.props.onChange}
        />
      </LabelControl>
    )
  }
}
