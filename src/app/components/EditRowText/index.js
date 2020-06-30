import React, { Component } from 'react'
import { TextField } from '@material-ui/core'

export default class EditRowText extends Component {
  render() {
    return (
      <TextField
        fullWidth
        className='no-padding-input'
        variant='outlined'
        value={this.props.value || ''}
        error={!!this.props.validation && !this.props.validation(this.props.value)}
        onChange={this.props.onChange}
      />
    )
  }
}
