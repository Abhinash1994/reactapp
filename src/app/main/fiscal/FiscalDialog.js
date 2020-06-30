import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, TextField, FormControlLabel, Icon, IconButton, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'
import * as authActions from 'app/auth/store/actions';
import moment from 'moment';
import LabelControl from '../../components/LabelControl';
import { NotificationManager } from 'react-notifications';
import Validations from '../../helper/Validations';

class FiscalDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
      fiscalyear: '',
      fromdate: '',
      todate: '',
      status: true,
    }
  };

  componentDidMount() {
    this.setState({ row: this.props.row, type: this.props.type });
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    if (this.state.row.fiscalyear === '') {
      NotificationManager.error("Please insert FiscalYear!", 'Fiscal Year Error')
    } else if (this.state.row.fromdate === '') {
      NotificationManager.error("Please insert From Date!", 'Fiscal Year Error')
    } else if (this.state.row.todate === '') {
      NotificationManager.error("Please insert To Date!", 'Fiscal Year Error')
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  onClose = () => {
    this.setState({ open: false });
  }

  handleChange = name => event => {
    var cursor = this.state.row;
    switch (name) {
      case 'status':
        cursor[name] = event.target.checked;
        break;
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }
  render() {
    const { row } = this.state;
    const { onRemove, user } = this.props;
    return (
      <div>
        {this.state.type === 'edit' && user.roles['Fiscal Year'] &&
          <div className="flex">
            {user.roles['Fiscal Year'].updateRole &&
              <IconButton
                className='color-limegreen'
                onClick={(ev) => {
                  ev.stopPropagation();
                  this.handleClickOpen();
                }}>
                <Icon>edit_attributes</Icon>
              </IconButton>}
            {user.roles['Fiscal Year'].deleteRole &&
              <IconButton
                className='color-brown'
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (window.confirm('Are you sure to remove this Fiscal Year?')) {
                    onRemove(this.state.row);
                  }
                }}>
                <Icon type="small">delete</Icon>
              </IconButton>}
          </div>
        }
        {this.state.type === 'add' && user.roles['Fiscal Year'] && user.roles['Fiscal Year'].saveRole &&
          <div className="flex items-center justify-end mb-6">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Fiscal Year</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Fiscal Year</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create fiscal year, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update fiscal year, please enter description here.
            </DialogContentText>
            }
            <LabelControl label="Fiscal Year">
              <TextField
                autoFocus
                fullWidth
                variant='outlined'
                value={this.state.row.fiscalyear || ''}
                error={!Validations.IntegerValidation(this.state.row.fiscalyear)}
                onChange={this.handleChange('fiscalyear')}
              />
            </LabelControl>
            <LabelControl label='From Date'>
              <TextField
                fullWidth
                variant='outlined'
                type="date"
                value={moment(this.state.row.fromdate).format("YYYY-MM-DD") || moment().format('YYYY-MM-DD')}
                onChange={this.handleChange('fromdate')}
              />
            </LabelControl>
            <LabelControl label="To Date">
              <TextField
                type="date"
                variant='outlined'
                value={moment(this.state.row.todate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
                onChange={this.handleChange('todate')}
                fullWidth
              />
            </LabelControl>
            <FormControlLabel value="status" label='Status' labelPlacement="start"
              control={<Checkbox checked={row.status}
                onClick={this.handleChange('status')} />}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleClose();
            }
            } color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
            </Button>
            <Button onClick={() => this.onClose()} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: authActions.logoutUser
  }, dispatch);
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FiscalDialog);